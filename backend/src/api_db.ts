import { Static, Type } from "@sinclair/typebox";
import * as mysql from "mysql2";
import { log } from "./logger";
import { StringEnum } from "./type_utils";

/* ============================= */
/* ====== Type definition ====== */
/* ============================= */

export interface IOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
  connectTimeout: number;
}

export const DateTimeFunctionSchema = StringEnum(
  ["year", "month", "day", "year_month", "year_month_day"],
  {
    title: "DateTimeFunction",
  }
);

export type DateTimeFunction = Static<typeof DateTimeFunctionSchema>;

export const AggregationFunctionSchema = StringEnum(
  ["min", "max", "avg", "sum", "count_distinct"],
  {
    title: "AggregationFunction",
  }
);

export type AggregationFunction = Static<typeof AggregationFunctionSchema>;

export const DataTypeSchema = StringEnum(
  ["datetime", "int", "float", "string"],
  {
    title: "DataType",
  }
);

export type DataType = Static<typeof DataTypeSchema>;

export const DataColumnSchema = Type.Object(
  {
    name: Type.String(),
    data_type: DataTypeSchema,
  },
  { title: "DataColumn" }
);

export type DataColumn = Static<typeof DataColumnSchema>;

export const ExecuteSQLResultSchema = Type.Object({
  // TODO: Use Type.Union after OpenAPI generator supports it.
  error: Type.Optional(Type.String()),
  columns: Type.Optional(Type.Array(DataColumnSchema)),
  rows: Type.Optional(Type.Array(Type.Array(Type.Any()))),
  totalRows: Type.Optional(Type.Number()),
  executionTimeMs: Type.Optional(Type.Number()),
});

export type ExecuteSQLResult = Static<typeof ExecuteSQLResultSchema>;

const dataTypeMap = new Map<number, DataType>([
  [8, "int"],
  [4, "int"],
  [3, "int"],
  [2, "int"],
  [1, "int"],
  [253, "string"],
  [12, "datetime"],
  [10, "datetime"],
  [5, "float"],
  [252, "string"],
]);

// ====================================================== //
// ====== Database connection pool to handle query ====== //
// ====================================================== //

export class DBPool {
  private opt: IOptions;
  private pool: mysql.Pool;

  public constructor(options: IOptions) {
    this.opt = options;
    try {
      this.pool = mysql.createPool({
        connectionLimit: this.opt.connectionLimit,
        host: this.opt.host,
        port: this.opt.port,
        user: this.opt.user,
        password: this.opt.password,
        database: this.opt.database,
      });
    } catch (error) {
      throw new Error("failed to initialized pool");
    }
  }

  public async ping() {
    return this.pool.query("SELECT 1");
  }

  public async executeSQL(sql: string): Promise<ExecuteSQLResult> {
    const beginAt = Date.now();
    return await new Promise<ExecuteSQLResult>(async (resolve, reject) => {
      if (!this.pool) {
        reject({
          error:
            "Pool was not created. Ensure pool is created when running the app.",
        });
      }
      sql = this.addLimitToSQL(
        sql,
        process.env.LIMIT_RETURNED_ROWS
          ? Number(process.env.LIMIT_RETURNED_ROWS)
          : 1000
      );
      log.info(`Executing SQL: ${sql}`);
      try {
        this.pool.execute(
          sql,
          (
            error: mysql.QueryError,
            results: mysql.RowDataPacket[] | mysql.ResultSetHeader,
            fields: mysql.FieldPacket[]
          ) => {
            // log.info(fields);
            if (error) {
              resolve({
                error: error.message,
              });
            } else {
              const endAt = Date.now();
              if (results instanceof Array) {
                resolve({
                  columns: fields
                    ? fields.map((field) => ({
                        name: field.name,
                        data_type: dataTypeMap.get((field as any).columnType)!,
                      }))
                    : [],
                  rows: results
                    ? results.map((row: { [s: string]: any }) =>
                        Object.values(row)
                      )
                    : [],
                  totalRows: results ? results.length : 0,
                  executionTimeMs: endAt - beginAt,
                });
              } else {
                resolve({
                  columns: fields
                    ? fields.map((field) => ({
                        name: field.name,
                        data_type: dataTypeMap.get((field as any).columnType)!,
                      }))
                    : [],
                  rows:
                    results.info != ""
                      ? [[results.info]]
                      : [
                          [
                            `Query OK, ${results.affectedRows} rows affected, ${results.warningStatus} warning`,
                          ],
                        ],
                  totalRows: results ? 1 : 0,
                  executionTimeMs: endAt - beginAt,
                });
              }
            }
          }
        );
        setTimeout(async () => {
          // try three times
          let isKilled = false;
          for (var i = 0; i < 3; i++) {
            if (!isKilled) {
              let taskId = await this.queryTaskID(sql);
              if (taskId == "<nil>") {
                break;
              }
              isKilled = await this.killQuery(taskId);
            }
          }
          resolve({
            error: "Execution time exceed 10min, Timeout",
          });
        }, 600000); // 1000 * 60 * 10 = 600000ms = 10min
      } catch (error: any) {
        resolve({ error: error.message });
      }
    });
  }

  private async queryTaskID(sql: string): Promise<string> {
    return await new Promise<string>(async (resolve, reject) => {
      let preparedQuery = this.pool.format(
        `SELECT CAST(ID AS CHAR) FROM INFORMATION_SCHEMA.CLUSTER_PROCESSLIST WHERE INFO = ?`,
        [sql]
      );
      this.pool.query(
        preparedQuery,
        (error, results: mysql.RowDataPacket[]) => {
          if (error) {
            log.warn(`Query ${preparedQuery}'s taskId faild`);
            reject("<nil>");
          }
          if (results && results.length == 0) {
            resolve("<nil>");
            return;
          }
          // log.info(`${JSON.stringify(results)}`)
          resolve(Object.values(results[0])[0]);
        }
      );
    });
  }

  private async killQuery(taskId: string): Promise<boolean> {
    return await new Promise<boolean>(async (resolve, reject) => {
      let preparedQuery = `KILL ${taskId}`;
      const q = this.pool.query(preparedQuery, (error) => {
        if (error) {
          log.warn(`Kill ${taskId} faild`);
          resolve(false);
        }
        resolve(true);
      });
    });
  }

  // limit the number of rows returned.
  private addLimitToSQL(sql: string, limit: number): string {
    if (!sql.match(/^\s*select/i)) {
      return sql;
    }
    const limitClause = sql.match(/limit\s+\d+;?$/i);
    if (limitClause) {
      const limitNum = parseInt(limitClause[0].split(" ")[1]);
      if (limitNum < limit) {
        return sql;
      }
      return sql.replace(/limit\s+\d+;?$/i, ` LIMIT ${limit};`);
    } else {
      return sql.replace(/;?$/, ` LIMIT ${limit};`);
    }
  }
}
