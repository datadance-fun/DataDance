import HttpErrors from "http-errors";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import { dbPool, Session } from "./session";
import { CreateGistResponseSchema, DefaultShareAPI } from "./api_share";
import { ExecuteSQLResultSchema } from "./api_db";
import { DataSetSchema, getList } from "./api_dataset";
import {
  ListColumnValuesRequestSchema,
  ListColumnValuesResponseSchema,
  PreviewRequestSchema,
  PreviewResponseSchema,
  QueryRequestSchema,
  QueryResponseSchema,
  query,
  preview,
  listColumnValues,
} from "./api_data";

export const routers: FastifyPluginAsync<
  any,
  any,
  TypeBoxTypeProvider
> = async (app, _opts) => {
  app.get(
    "/",
    {
      schema: {
        operationId: "healthCheck",
        summary: "Health check",
        response: { 200: Type.Object({ ok: Type.Boolean() }) },
      },
    },
    async (_req) => {
      return { ok: true };
    }
  );

  app.post(
    "/session/create",
    {
      schema: {
        operationId: "sessionCreate",
        summary: "Create new session",
        response: {
          200: Type.Object({
            sessionId: Type.String(),
          }),
        },
      },
    },
    async (_req) => {
      const session = await Session.create();
      return {
        sessionId: session.id,
      };
    }
  );

  app.post(
    "/session/verify",
    {
      schema: {
        operationId: "sessionVerify",
        summary: "Verify session",
        body: Type.Object({
          sessionId: Type.String(),
        }),
        response: {
          200: Type.Object({
            isValid: Type.Boolean(),
          }),
        },
      },
    },
    async (req) => {
      try {
        await Session.fromId(req.body.sessionId);
        return { isValid: true };
      } catch (err: any) {
        if (err.status === 404) {
          return { isValid: false };
        }
        throw err;
      }
    }
  );

  app.post(
    "/notebook/cell/sql_execute",
    {
      schema: {
        operationId: "notebookCellExecuteSQL",
        summary: "Execute SQL",
        body: Type.Object({
          sessionId: Type.String(),
          sql: Type.String(),
        }),
        response: {
          200: ExecuteSQLResultSchema,
        },
      },
    },
    async (req) => {
      const session = await Session.fromId(req.body.sessionId);
      const db = session.getDB();
      return await db.executeSQL(req.body.sql);
    }
  );

  app.post(
    "/notebook/share",
    {
      schema: {
        operationId: "notebookShare",
        summary: "Share notebook via gist",
        body: Type.Object({
          data: Type.String(),
        }),
        response: {
          200: CreateGistResponseSchema,
        },
      },
    },
    async (req) => {
      return await DefaultShareAPI.createGist(req.body.data);
    }
  );

  // Intentionally use POST instead of GET to be friendly for API client generators.
  app.post(
    "/notebook/get_share",
    {
      schema: {
        operationId: "notebookGetSharedData",
        summary: "Get notebook shared in gist",
        body: Type.Object({
          gistId: Type.String(),
        }),
        response: {
          200: Type.Object({
            data: Type.String(),
          }),
        },
      },
    },
    async (req) => {
      const data = await DefaultShareAPI.getGist(req.body.gistId);
      return { data };
    }
  );

  app.post(
    "/datasets/list",
    {
      schema: {
        operationId: "datasetsList",
        summary: "List all data sets",
        response: {
          200: Type.Array(DataSetSchema),
        },
      },
    },
    async (req) => {
      return getList();
    }
  );

  app.post(
    "/data/preview",
    {
      schema: {
        operationId: "dataPreview",
        summary: "Preview the data",
        body: PreviewRequestSchema,
        response: {
          200: PreviewResponseSchema,
        },
      },
    },
    async (req) => {
      return preview(req.body, dbPool);
    }
  );

  app.post(
    "/data/column/list_values",
    {
      schema: {
        operationId: "dataListColumnValues",
        summary: "List possible values of a column",
        body: ListColumnValuesRequestSchema,
        response: {
          200: ListColumnValuesResponseSchema,
        },
      },
    },
    async (req) => {
      return listColumnValues(req.body, dbPool);
    }
  );

  app.post(
    "/data/query",
    {
      schema: {
        operationId: "dataQuery",
        summary: "Query the data",
        body: QueryRequestSchema,
        response: {
          200: QueryResponseSchema,
        },
      },
    },
    async (req) => {
      return query(req.body, dbPool);
    }
  );
};
