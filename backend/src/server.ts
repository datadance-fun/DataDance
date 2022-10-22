import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyRequestLogger from "@mgcrea/fastify-request-logger";
import fastifyCompress from "@fastify/compress";
import fastifyCORS from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastify from "fastify";
import { log } from "./logger";
import { routers } from "./routers";

export async function buildApp() {
  const app = fastify({
    logger: log,
    disableRequestLogging: true,
    ajv: {
      // See https://www.fastify.io/docs/latest/Reference/Type-Providers/
      customOptions: {
        strict: "log",
        keywords: ["kind", "modifier"],
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  const corsOrigins = ["http://localhost:3000", /\.amplifyapp\.com$/];
  if (process.env.PLAYGROUND_CORS_ORIGIN) {
    corsOrigins.push(process.env.PLAYGROUND_CORS_ORIGIN);
  }

  await app.register(fastifyCompress);
  await app.register(fastifyRequestLogger);
  await app.register(fastifyCORS, {
    origin: corsOrigins,
  });
  await app.register(fastifySwagger, {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "Data Dance API",
        version: "0.1.0",
      },
    },
    exposeRoute: true,
  });

  const prefix = process.env.PLAYGROUND_API_PREFIX ?? "/api";
  await app.register(routers, {
    prefix,
  });
  log.info(`API base path: ${prefix}`);

  return app;
}
