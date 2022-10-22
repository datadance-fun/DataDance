import { nanoid } from "nanoid";
import { Type, Static } from "@sinclair/typebox";
import HttpErrors from "http-errors";
import { Octokit } from "@octokit/rest";
import { log } from "./logger";

export const CreateGistResponseSchema = Type.Object({
  gistId: Type.String(),
  url: Type.Optional(Type.String()),
});

export type CreateGistResponse = Static<typeof CreateGistResponseSchema>;

export interface ShareAPI {
  createGist(data: string): Promise<CreateGistResponse>;
  getGist(id: string): Promise<string>;
}

export class ShareAPIInMemory implements ShareAPI {
  private store: Record<string, string> = {};

  async createGist(data: string): Promise<CreateGistResponse> {
    const id = nanoid();
    this.store[id] = data;
    return {
      gistId: id,
    };
  }
  async getGist(id: string): Promise<string> {
    if (!this.store[id]) {
      throw new HttpErrors.NotFound("Gist not found");
    }
    return this.store[id];
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
      "PLAYGROUND_GITHUB_TOKEN is not configured, using in-memory Share API. The data will be lost after server is restarted."
    );
    return new ShareAPIInMemory();
  } else {
    return new ShareAPIGist();
  }
})();
