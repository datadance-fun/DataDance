import { nanoid } from "nanoid";
import { Type, Static } from "@sinclair/typebox";
import HttpErrors from "http-errors";
import { Octokit } from "@octokit/rest";
import { log } from "./logger";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export const CreateGistResponseSchema = Type.Object({
  gistId: Type.String(),
  url: Type.Optional(Type.String()),
});

export type CreateGistResponse = Static<typeof CreateGistResponseSchema>;

export interface ShareAPI {
  createGist(data: string): Promise<CreateGistResponse>;
  getGist(id: string): Promise<string>;
}

type DBSchema = {
  gists: Record<string, string>;
};

export class ShareAPILocal implements ShareAPI {
  db = new Low<DBSchema>(new JSONFile("./db_share.json"));

  constructor() {
    this.db.read().then(() => {
      log.info("Share API database loaded");
      this.db.data ||= { gists: {} };
    });
  }

  async createGist(data: string): Promise<CreateGistResponse> {
    const id = nanoid();

    this.db.data!.gists[id] = data;
    this.db.write();

    return {
      gistId: id,
    };
  }

  async getGist(id: string): Promise<string> {
    if (!this.db.data!.gists[id]) {
      throw new HttpErrors.NotFound("Gist not found");
    }
    return this.db.data!.gists[id];
  }
}

export class ShareAPIGist implements ShareAPI {
  private octokit = new Octokit({
    auth: process.env.PLAYGROUND_GITHUB_TOKEN,
    userAgent: "data_dance_playground",
    log: {
      debug: (message) => log.debug(message),
      info: (message) => log.info(message),
      warn: (message) => log.warn(message),
      error: (message) => log.error(message),
    },
  });

  public async createGist(data: string): Promise<CreateGistResponse> {
    try {
      const files: Record<string, { content: string }> = {};
      files[`data_dance.json`] = { content: data };
      const resp = await this.octokit.rest.gists.create({
        description: "Code shared from Data Dance",
        files,
        public: false,
      });
      return { gistId: resp.data.id!, url: resp.data.html_url! };
    } catch (err: any) {
      log.error(err, "Send API request failed");
      throw new HttpErrors.InternalServerError();
    }
  }

  public async getGist(id: string): Promise<string> {
    try {
      const resp = await this.octokit.rest.gists.get({
        gist_id: id,
      });
      const { files } = resp.data;
      for (const key in files) {
        return files[key]?.content ?? "";
      }
      throw new HttpErrors.BadRequest("Unrecognized content in gist");
    } catch (err: any) {
      if (err.status === 404) {
        throw new HttpErrors.NotFound("Gist not found");
      }
      log.error(err, "Send API request failed");
      throw new HttpErrors.InternalServerError();
    }
  }
}

export const DefaultShareAPI: ShareAPI = (() => {
  if (!process.env.PLAYGROUND_GITHUB_TOKEN) {
    log.warn(
      "PLAYGROUND_GITHUB_TOKEN is not configured, using local Share API."
    );
    return new ShareAPILocal();
  } else {
    return new ShareAPIGist();
  }
})();
