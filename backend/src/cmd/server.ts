import "dotenv/config";
import { AddressInfo } from "net";
import { log } from "../logger";
import { buildApp } from "../server";

const port = Number(process.env.PLAYGROUND_PORT ?? 1345);
const host = process.env.PLAYGROUND_HOST ?? "127.0.0.1";

const app = await buildApp();
await app.listen({ port, host });

const addr = app.server.address() as AddressInfo;
log.info(`OpenAPI doc: http://${addr.address}:${addr.port}/docs/`);
