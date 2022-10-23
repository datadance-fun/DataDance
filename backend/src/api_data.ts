import { Type, Static } from "@sinclair/typebox";
import {
  AggregationFunctionSchema,
  DataColumnSchema,
  DataTypeSchema,
  DateTimeFunction,
  DateTimeFunctionSchema,
  DBPool,
  ExecuteSQLResult,
} from "./api_db";
import { log } from "./logger";
import { StringEnum } from "./type_utils";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { throttle } from "lodash-es";

type DBSchema = {
  listValues: Record<string, string>;
};

const cache = new Low<DBSchema>(new JSONFile("./db_data_cache.json"));
cache.read().then(() => {
  log.info("Data cache loaded");
  cache.data ||= { listValues: {} };
});

const cacheFlush = throttle(() => {
  cache.write().then(() => log.info("Data cache persisted"));
}, 10 * 1000);

/* ============================= */
/* ====== Type definition ====== */
/* ============================= */

export const DataSourceSchema = Type.Object(
  {
    query: Type.Optional(Type.String()),
    dataset_id: Type.Optional(Type.String()),
  },
  {
    title: "DataSource",
  }
);

export type DataSource = Static<typeof DataSourceSchema>;

export const DataResultSchema = Type.Object(
  {
    columns: Type.Array(DataColumnSchema),
    rows: Type.Array(Type.Array(Type.Any())),
  },
  {
    title: "DataResult",
  }
);

export type DataResult = Static<typeof DataResultSchema>;

export const PreviewRequestSchema = Type.Object(
  {
    data_source: DataSourceSchema,
    header_only: Type.Optional(Type.Boolean()),
  },
  {
    title: "PreviewRequest",
  }
);

export type PreviewRequest = Static<typeof PreviewRequestSchema>;

export const PreviewResponseSchema = DataResultSchema;

export type PreviewResponse = Static<typeof PreviewResponseSchema>;

export const ListColumnValuesRequestSchema = Type.Object(
  {
    data_source: DataSourceSchema,
    column_name: Type.String(),
    column_type: DataTypeSchema,
    temporal_value_function: Type.Optional(DateTimeFunctionSchema),
    categorical_value_include: Type.Optional(Type.String()),
  },
  {
    title: "ListColumnValuesRequest",
  }
);

export type ListColumnValuesRequest = Static<
  typeof ListColumnValuesRequestSchema
>;

export const ListColumnValuesResponseSchema = Type.Object(
  {
    value_kind: Type.Optional(
      StringEnum(["temporal", "quantitive", "categorical"])
    ),
    quantitive_info: Type.Optional(
      Type.Object({
        min: Type.Number(),
        max: Type.Number(),
      })
    ),
    temporal_info: Type.Optional(
      Type.Object({
        min_timestamp_ms: Type.Number(),
        max_timestamp_ms: Type.Number(),
      })
    ),
    categorical_info: Type.Optional(
      Type.Object({
        values: Type.Array(Type.Optional(Type.String())),
      })
    ),
  },
  { title: "ListColumnValuesResponse" }
);

export type ListColumnValuesResponse = Static<
  typeof ListColumnValuesResponseSchema
>;

export const QueryFilterSchema = Type.Object(
  {
    column_name: Type.String(),
    temporal_value_function: Type.Optional(DateTimeFunctionSchema),
    kind: StringEnum(["min_max_temporal", "min_max_quantitive", "one_of"]),
    min: Type.Optional(Type.Number()),
    max: Type.Optional(Type.Number()),
    one_of: Type.Optional(Type.Array(Type.Optional(Type.String()))),
  },
  { title: "QueryFilter" }
);

export type QueryFilter = Static<typeof QueryFilterSchema>;

export const QueryDimensionSchema = Type.Object(
  {
    is_count: Type.Boolean(),
    non_count_options: Type.Optional(
      Type.Object({
        column_name: Type.String(),
        aggregation_function: Type.Optional(AggregationFunctionSchema),
        temporal_value_function: Type.Optional(DateTimeFunctionSchema),
      })
    ),
  },
  {
    title: "QueryDimension",
  }
);

export type QueryDimension = Static<typeof QueryDimensionSchema>;

export const QueryRequestSchema = Type.Object(
  {
    data_source: DataSourceSchema,
    filters: Type.Optional(Type.Array(QueryFilterSchema)),
    x: Type.Optional(QueryDimensionSchema),
    y: Type.Optional(QueryDimensionSchema),
    color: Type.Optional(QueryDimensionSchema),
    // TODO: add more
  },
  { title: "QueryRequest" }
);

export type QueryRequest = Static<typeof QueryRequestSchema>;

export const QueryResponseSchema = DataResultSchema;

export type QueryResponse = Static<typeof QueryResponseSchema>;

/* =========================== */
/* ====== Util function ====== */
/* =========================== */

/**
 * Return the datetime function expression.
 * @param data_time_func DateTimeFunction
 * @param col Column name
 * @returns in format of `DATE_FORMAT(${col}, '%Y...')`;
 */
function timeFuncTransfrom(
  data_time_func: DateTimeFunction | undefined,
  col: string
) {
  switch (data_time_func) {
    case "year":
      return `DATE_FORMAT(${col}, '%Y')`;
    case "month":
      return `DATE_FORMAT(${col}, '%m')`;
    case "day":
      return `DATE_FORMAT(${col}, '%d')`;
    case "year_month":
      return `DATE_FORMAT(${col}, '%Y-%m')`;
    case "year_month_day":
      return `DATE_FORMAT(${col}, '%Y-%m-%d')`;
    default:
      return col;
  }
}

/**
 * Remove the tail semicolon of the query in data_source
 * @param data_source
 * @returns data_source
 */
function removeSemicolonInDataSource(data_source: DataSource) {
  if (data_source.query) {
    if (data_source.query.length > 0) {
      data_source.query = data_source.query.replace(/;$/g, "");
    } else {
      data_source.query = undefined;
    }
  }
  return data_source;
}

/**
 * Get the aggarate function name of a dimension
 * @param x QueryDimension
 * @returns the aggarate function name
 */
function getAggFuncName(x: QueryDimension | undefined): string | undefined {
  if (x) {
    return x.is_count
      ? "COUNT"
      : x.non_count_options!.aggregation_function
      ? x.non_count_options!.aggregation_function == "count_distinct"
        ? "APPROX_COUNT_DISTINCT"
        : `${x.non_count_options!.aggregation_function}`
      : undefined;
  }
}

/**
 * Get Aggregateor expression
 * @param x QueryDimension
 * @returns Aggregateor expression like: agg_func_name(`col_name`)
 */
function getAggregateor(x: QueryDimension | undefined): string | undefined {
  if (x) {
    if (x.is_count) {
      return "COUNT(*)";
    }
    const agg_func_name = getAggFuncName(x);
    const col_name = `\`${x.non_count_options!.column_name}\``;
    if (agg_func_name) {
      return `${agg_func_name}(${timeFuncTransfrom(
        x.non_count_options!.temporal_value_function,
        col_name
      )})`;
    } else {
      return `${timeFuncTransfrom(
        x.non_count_options!.temporal_value_function,
        col_name
      )}`;
    }
  }
}

/**
 * adjust the the order of x, y, color
 * @param dims QueryDimension
 * @param order the order of [x, y, color]
 */
function adjustOrder(
  dims: (QueryDimension | undefined)[],
  order: string[]
): void {
  // move date_time with function to the start
  for (let i = 0; i < dims.length; i++) {
    if (dims[i]?.non_count_options?.temporal_value_function) {
      const remove_dim = dims.splice(i, 1);
      dims.unshift(remove_dim[0]);
      const remove_order = order.splice(i, 1);
      order.unshift(remove_order[0]);
    }
  }
  // move undefined to the start
  let nil = 0;
  for (let i = 1; i < dims.length; i++) {
    if (!dims[i]) {
      const remove_dim = dims.splice(i, 1);
      dims.unshift(remove_dim[0]);
      const remove_order = order.splice(i, 1);
      order.unshift(remove_order[0]);
      nil++;
    }
  }
  // move aggregator to the end
  for (let i = dims.length - 2; i >= nil; i--) {
    if (dims[i]?.non_count_options?.aggregation_function) {
      const remove_dim = dims.splice(i, 1);
      dims.push(remove_dim[0]);
      const remove_order = order.splice(i, 1);
      order.push(remove_order[0]);
    }
  }
  // move count(*) to the end
  for (let i = dims.length - 2; i >= nil; i--) {
    if (dims[i]?.is_count) {
      const remove_dim = dims.splice(i, 1);
      dims.push(remove_dim[0]);
      const remove_order = order.splice(i, 1);
      order.push(remove_order[0]);
    }
  }
}

/* ================================ */
/* ====== API implementation ====== */
/* ================================ */

export async function preview(
  request: PreviewRequest,
  db: DBPool
): Promise<PreviewResponse> {
  const data_source = removeSemicolonInDataSource(request.data_source);
  const header_only = request.header_only;
  var sql: string;
  if (header_only) {
    sql = `SELECT * FROM ${
      data_source.query ? `(${data_source.query})` : data_source.dataset_id
    } AS t LIMIT 0`;
  } else {
    sql = `SELECT * FROM ${
      data_source.query ? `(${data_source.query})` : data_source.dataset_id
    } AS t LIMIT 200`;
  }
  const sql_result: ExecuteSQLResult = await db.executeSQL(sql);
  return {
    columns: sql_result.columns ? sql_result.columns : [],
    rows: sql_result.rows ? sql_result.rows : [],
  };
}

export async function listColumnValues(
  request: ListColumnValuesRequest,
  db: DBPool
): Promise<ListColumnValuesResponse> {
  const cacheKey = JSON.stringify(request);
  {
    const value = cache.data!.listValues[cacheKey];
    if (value) {
      log.info(request, "Reused cache for listColumnValues request");
      return JSON.parse(value);
    }
  }
  const data = await listColumnValuesFromDB(request, db);
  cache.data!.listValues[cacheKey] = JSON.stringify(data);
  cacheFlush();
  return data;
}

export async function listColumnValuesFromDB(
  request: ListColumnValuesRequest,
  db: DBPool
): Promise<ListColumnValuesResponse> {
  const data_source = removeSemicolonInDataSource(request.data_source);
  const column_name = `\`${request.column_name}\``;
  const categorical_value_include = request.categorical_value_include;
  const temporal_value_function = request.temporal_value_function;
  const source = data_source.query
    ? `(${data_source.query})`
    : data_source.dataset_id;
  switch (request.column_type) {
    case "datetime": {
      if (temporal_value_function) {
        const sql = `SELECT DISTINCT ${timeFuncTransfrom(
          temporal_value_function,
          column_name
        )} AS ${column_name} FROM ${source} AS t GROUP BY ${column_name}`;
        const sql_result: ExecuteSQLResult = await db.executeSQL(sql);
        return {
          value_kind: "categorical",
          categorical_info: {
            values: sql_result.rows
              ? sql_result.rows.map((row) => String(row[0]))
              : [],
          },
        };
      } else {
        const sql = `SELECT MIN(${column_name}), MAX(${column_name}) FROM ${source} AS t`;
        const sql_result: ExecuteSQLResult = await db.executeSQL(sql);
        return {
          value_kind: "temporal",
          temporal_info: sql_result.rows
            ? {
                min_timestamp_ms: Math.floor(
                  new Date(sql_result.rows[0][0]).getTime()
                ),
                max_timestamp_ms: Math.floor(
                  new Date(sql_result.rows[0][1]).getTime()
                ),
              }
            : { min_timestamp_ms: 0, max_timestamp_ms: 0 },
        };
      }
    }
    case "float":
    case "int": {
      const sql = `SELECT MIN(${column_name}), MAX(${column_name}) FROM ${source} AS t`;
      const sql_result = await db.executeSQL(sql);
      return {
        value_kind: "quantitive",
        quantitive_info: sql_result.rows
          ? { min: sql_result.rows[0][0], max: sql_result.rows[0][1] }
          : { min: 0, max: 0 },
      };
    }
    case "string": {
      let sql: string;
      if (categorical_value_include) {
        sql = `SELECT DISTINCT ${column_name} AS x FROM ${source} AS t WHERE ${column_name} LIKE '%${categorical_value_include}%'`;
      } else {
        sql = `SELECT DISTINCT ${column_name} AS x FROM ${source} AS t`;
      }
      const sql_result = await db.executeSQL(sql);
      return {
        value_kind: "categorical",
        categorical_info: sql_result.rows
          ? { values: sql_result.rows.map((row) => String(row[0])) }
          : { values: [] },
      };
    }
    default:
      log.info(`Unknown column type! ${request.column_type}`);
      return {};
  }
}

export async function query(
  request: QueryRequest,
  db: DBPool
): Promise<QueryResponse> {
  const data_source = removeSemicolonInDataSource(request.data_source);
  const filters = request.filters;
  const x = request.x;
  const y = request.y;
  const color = request.color;
  let sql: string = `FROM ${
    data_source.query ? `(${data_source.query})` : data_source.dataset_id
  } AS t`;

  // add filters to where clause
  if (filters && filters.length > 0) {
    sql += " WHERE ";
    sql += filters
      .map((filter) => {
        const column_name = `\`${filter.column_name}\``;
        if (filter.kind == "min_max_quantitive") {
          return `${column_name} BETWEEN ${filter.min} AND ${filter.max}`;
        } else if (filter.kind == "min_max_temporal") {
          const min = filter.min! / 1000;
          const max = filter.max! / 1000;
          switch (filter.temporal_value_function) {
            case "year":
              return `${column_name} BETWEEN FROM_UNIXTIME(${min}, '%Y') AND FROM_UNIXTIME(${max}, '%Y')`;
            case "month":
              return `${column_name} BETWEEN FROM_UNIXTIME(${min}, '%m') AND FROM_UNIXTIME(${max}, '%m')`;
            case "day":
              return `${column_name} BETWEEN FROM_UNIXTIME(${min}, '%d') AND FROM_UNIXTIME(${max}, '%d')`;
            case "year_month":
              return `${column_name} BETWEEN FROM_UNIXTIME(${min}, '%Y-%m') AND FROM_UNIXTIME(${max}, '%Y-%m')`;
            case "year_month_day":
              return `${column_name} BETWEEN FROM_UNIXTIME(${min}, '%Y-%m-%d') AND FROM_UNIXTIME(${max}, '%Y-%m-%d')`;
            default:
              return `${column_name} BETWEEN FROM_UNIXTIME(${min}) AND FROM_UNIXTIME(${max})`;
          }
        } else if (filter.kind == "one_of") {
          return `${column_name} IN (${filter.one_of
            ?.map((v) => `"${v}"`)
            .join(",")})`;
        } else {
          log.error(`Unknown kind of filter: ${filter.kind}`);
          return "1 = 1";
        }
      })
      .join(" AND ");
  }

  let order: string[] = ["x", "y", "color"];
  let dims: (QueryDimension | undefined)[] = [x, y, color];
  adjustOrder(dims, order);
  // column_name in select
  let select = [];
  // column_name in group by
  let group_by = [];
  for (let i = 0; i < dims.length; i++) {
    const agg = getAggregateor(dims[i]);
    if (agg) {
      // First, add aggregator into select
      // If the aggregate function is null, add the column name into group by
      select.push(`${agg} as ${order[i]}`);
      if (!getAggFuncName(dims[i])) {
        group_by.push(order[i]);
      }
    }
  }
  // If there is no column in select, just return.
  if (select.length == 0) {
    log.info("No dimension selected");
    return { columns: [], rows: [] };
  }
  sql = `SELECT ${select.join(", ")} ${sql}`;
  // If there are columns in group by, add group by
  if (group_by.length > 0) {
    sql += ` GROUP BY `;
    sql += group_by.join(",");
  }

  const sql_result: ExecuteSQLResult = await db.executeSQL(sql);
  return {
    columns: sql_result.columns ? sql_result.columns : [],
    rows: sql_result.rows ? sql_result.rows : [],
  };
}
