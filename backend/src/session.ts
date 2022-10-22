import HttpErrors from "http-errors";
import { log } from "./logger";
import { DBPool } from "./api_db";

export const dbPool = new DBPool({
  host: String(process.env.MY_SQL_DB_HOST ?? "localhost"),
  port: Number(process.env.MY_SQL_DB_PORT ?? 4000),
  user: String(process.env.MY_SQL_DB_USER ?? "root"),
  password: String(process.env.MY_SQL_DB_PASSWORD ?? ""),
  database: String(process.env.MY_SQL_DB_DATABASE ?? "test"),
  connectionLimit: Number(process.env.MY_SQL_DB_CONNECTION_LIMIT ?? 100),
  connectTimeout: Number(process.env.MY_SQL_DB_CONNECT_TIMEOUT ?? 600000), // 1000 * 60 * 10 = 600000ms = 10min
});

export class Session {
  public id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static async create() {
    log.info("Creating new session");
    const id = Math.random().toString(36).slice(-8);
    const session = new Session(id);
    return session;
  }

  public static async fromId(sessionId: string) {
    if (!sessionId) {
      throw new HttpErrors.Unauthorized("Session is invalid");
    }
    return new Session(sessionId);
  }

  public getDB() {
    return dbPool;
  }
}
