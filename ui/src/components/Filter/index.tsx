import * as Portal from "@radix-ui/react-portal";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { Group, Text, Stack, LoadingOverlay, clsx } from "@mantine/core";
import {
  CookieIcon,
  CrumpledPaperIcon,
  GearIcon,
  ScissorsIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { FilterPlaceholder } from "./PlaceHolder";
import { useThrottleFn } from "ahooks";
import { API, BlockAPI, BlockToolData } from "@editorjs/editorjs";
import { DataSourceSelect } from "./DataSourceSelect";
import { Column, Container, Panel } from "./Layout";
import { Select } from "../Compact/Select";
import { Button } from "../Compact/Button";
import { FilterInput } from "./FilterInput";
import { Chart } from "../Chart";
import { DimensionSelect } from "./DimensionSelect";
import {
  DataColumn,
  DataColumnDataTypeEnum,
  DatasetsList200ResponseInner,
  DataSource as IDataSource,
  QueryDimension,
  QueryRequest,
} from "@/api";
import { useQuery } from "react-query";
import { DefaultClient } from "@/services/client";
import { isEmpty } from "lodash";
import { AnyMark } from "vega-lite/build/src/mark";
import { DataResult } from "@/api";
import { useBlockFocus } from "./useBlockFocus";
import { AxisOptionSelect, AxisOptionValue } from "./AxisOptionSelect";

export type FilterFormValues = QueryRequest & {
  mark: AnyMark;
  srcDataSet: DatasetsList200ResponseInner;
  xAxis?: AxisOptionValue;
  yAxis?: AxisOptionValue;
};

export const FilterPanel: React.FC<{
  onChange: (query: FilterFormValues) => void;
  initialValues?: FilterFormValues;
}> = ({ onChange, initialValues }) => {
  const form = useForm<FilterFormValues>({
    initialValues: !isEmpty(initialValues)
      ? initialValues
      : {
          data_source: {},
          // @ts-ignore
          x: {},
          // @ts-ignore
          y: {},
          // filters: [{ key: "name", value: new Set<string>() }],
          filters: [],
          mark: "line",
        },
  });

  const dataSource: IDataSource = form.values.data_source;

  const { data: dataPreview } = useQuery(
    ["datapreview", dataSource.dataset_id, dataSource.query],
    () => {
      return DefaultClient.API.dataPreview({
        data_source: dataSource,
        header_only: true,
      });
    },
    {
      enabled: !!dataSource.dataset_id || !!dataSource.query,
    }
  );

  const axisColumns: DataColumn[] = dataPreview?.data.columns || [];

  useEffect(() => {
    onChange(form.values);
  }, [form.values, onChange]);

  return (
    <Container>
      <Column>
        <Panel title="Data" icon={<CrumpledPaperIcon />}>
          <div className="flex items-center gap-x-2">
            {form.values.srcDataSet?.info?.name ||
              form.values.data_source.dataset_id ||
              "No dataset"}
            <DataSourceSelect
              value={{
                dataSource: form.values.data_source,
                srcDataSet: form.values.srcDataSet,
              }}
              onChange={({ dataSource, srcDataSet }) => {
                form.setValues({
                  mark: "line",
                  srcDataSet,
                  data_source: dataSource,
                  x: {},
                  y: {},
                  color: {},
                  filters: [],
                  xAxis: undefined,
                  yAxis: undefined,
                });
              }}
            ></DataSourceSelect>
          </div>
        </Panel>
        <Panel title="Visualization" icon={<CookieIcon />}>
          <Stack spacing="md">
            <Select
              options={[
                { value: "line", label: "Line" },
                { value: "table", label: "Table" },
                { value: "bar", label: "Bar" },
                { value: "area", label: "Area" },
                { value: "point", label: "Scatter" },
              ]}
              {...form.getInputProps("mark")}
            />
            <div>
              <Group spacing="md">
                <Text size="xs">X Axis</Text>
                {!isEmpty(form.values.x) && (
                  <AxisOptionSelect
                    value={form.values.xAxis}
                    onChange={(value) => {
                      form.setFieldValue("xAxis", value);
                    }}
                  />
                )}
              </Group>
              <div className="mb-1"></div>
              <Stack spacing="sm">
                <DimensionSelect
                  {...form.getInputProps("x")}
                  onChange={(xAxis) => {
                    form.setFieldValue("x", xAxis);
                  }}
                  columns={axisColumns}
                />
              </Stack>
            </div>
            <div>
              <Group spacing="sm">
                <Text size="xs">Y Axis</Text>
                {!isEmpty(form.values.x) && (
                  <AxisOptionSelect
                    value={form.values.yAxis}
                    onChange={(value) => {
                      form.setFieldValue("yAxis", value);
                    }}
                  />
                )}
              </Group>
              <div className="mb-1"></div>
              <Stack spacing="sm">
                <DimensionSelect
                  {...form.getInputProps("y")}
                  onChange={(yAxis) => {
                    form.setFieldValue("y", yAxis);
                  }}
                  columns={axisColumns}
                />
              </Stack>
            </div>
            <div>
              <Group spacing="md">
                <Text size="xs">Color</Text>
                {!isEmpty(form.values.color) && (
                  <span className="cursor-pointer">
                    <Cross2Icon
                      onClick={() => {
                        form.setFieldValue("color", {});
                      }}
                    />
                  </span>
                )}
              </Group>
              <div className="mb-1"></div>
              <Stack spacing="sm">
                <DimensionSelect
                  {...form.getInputProps("color")}
                  onChange={(xAxis) => {
                    form.setFieldValue("color", xAxis);
                  }}
                  columns={axisColumns}
                />
              </Stack>
            </div>
          </Stack>
        </Panel>
        <Panel title="Filter" icon={<ScissorsIcon />}>
          <Stack spacing="lg">
            <FilterInput
              form={form}
              source={dataSource}
              values={form.values.filters || []}
              fieldKey={"filters"}
              options={axisColumns}
            />
            <Button
              type="primary"
              onClick={() =>
                form.insertListItem("filters", {
                  column_name: "",
                })
              }
            >
              Add Filter
            </Button>
          </Stack>
        </Panel>
      </Column>
    </Container>
  );
};

export type IFilterProps = {
  api: API;
  thisBlock: BlockAPI;
  data?: BlockToolData<FilterFormValues>;
  onChange?: (query: BlockToolData<FilterFormValues>) => void;
};

const pickEncoding = (query: FilterFormValues, result: DataResult) => {
  if (!query) {
    return {};
  }
  const encoding: { [index: string]: any } = {};

  const fields: string[] = [];

  const getEncoding = (axis?: QueryDimension) => {
    if (!axis) {
      return null;
    }
    if (axis.is_count) {
      return {
        field: "Count",
        type: "quantitative",
        scale: {
          scheme: "tableau10",
        },
      };
    }
    if (axis.non_count_options?.column_name) {
      fields.push(axis.non_count_options.column_name);
      return {
        field: axis.non_count_options.column_name,
        type: axis.non_count_options.temporal_value_function
          ? "quantitative"
          : "quantitative",
        // timeUnit: axis.non_count_options.temporal_value_function ?? undefined,
        scale: {
          scheme: "tableau10",
        },
      };
    }
    return null;
  };

  const x = getEncoding(query.x);
  const y = getEncoding(query.y);
  const color = getEncoding(query.color);

  if (x) {
    encoding.x = query.xAxis ? { ...x, ...query.xAxis } : x;
  }
  if (y) {
    encoding.y = query.yAxis ? { ...y, ...query.yAxis } : y;
  }
  if (color) {
    encoding.color = color;
  }
  const transform: { flatten?: string[]; calculate?: string; as?: string }[] = [
    { flatten: ["rows"] },
  ];
  const { columns } = result;
  columns.forEach((col, index) => {
    if (encoding[col.name]) {
      const types: { [index: string]: string } = {};
      if (
        col.data_type === DataColumnDataTypeEnum.String ||
        col.data_type === DataColumnDataTypeEnum.Datetime
      ) {
        types.type = "ordinal";
      }
      encoding[col.name] = {
        ...encoding[col.name],
        ...types,
      };
    }
    transform.push({
      calculate: `datum.rows[${index}]`,
      as: encoding[col.name]?.field,
    });
  });

  return {
    transform,
    encoding,
  };
};

export const Filter = ({ api, thisBlock, data, onChange }: IFilterProps) => {
  const isFocus = useBlockFocus(api, thisBlock);

  const [query, setQuery] = useState<FilterFormValues>(
    !isEmpty(data)
      ? data
      : {
          // @ts-ignore
          x: {},
          // @ts-ignore
          y: {},
          // @ts-ignore
          color: {},
          filters: [],
          data_source: {},
          mark: "line",
          srcDataSet: {},
        }
  );

  const { run: handleQueryChange } = useThrottleFn(setQuery, { wait: 200 });

  const {
    data: chartData,
    isLoading,
    isFetching,
    isFetched,
  } = useQuery(
    [
      "dataquery",
      thisBlock.id,
      query.x,
      query.y,
      query.filters,
      query.data_source,
      query.color,
    ],
    () => {
      const { x, y, color, data_source, filters: rawFilters } = query;
      const filters = (rawFilters || [])
        .filter((item) => {
          return item.kind;
        })
        .map((item) => {
          if (item.one_of && item.one_of instanceof Set) {
            return {
              ...item,
              one_of: Array.from(item.one_of),
            };
          }
          return item;
        });
      return DefaultClient.API.dataQuery({
        x: isEmpty(x) ? undefined : x,
        y: isEmpty(y) ? undefined : y,
        color: isEmpty(color) ? undefined : color,
        data_source: data_source,
        filters: filters.length ? filters : undefined,
      });
    },
    {
      enabled:
        (!!query.data_source.dataset_id || !!query.data_source.query) &&
        (!isEmpty(query.x) || !isEmpty(query.y)),
    }
  );

  return (
    <div
      className={clsx(
        { [`ring`]: isFocus },
        `ring-offset-4 ring-rose-500 ring-opacity-60`,
        "rounded my-4"
      )}
    >
      {!isFetched && <FilterPlaceholder />}
      <div className="relative">
        {chartData?.data && (
          <Chart
            spec={{
              width: "container",
              height: 350,
              autosize: {
                type: "fit",
                contains: "padding",
              },
              ...pickEncoding(query, chartData?.data),
              mark: query.mark,
              data: { name: "data" }, // note: vega-lite data attribute is a plain object instead of an array
            }}
            data={{ data: chartData.data }}
          />
        )}
        <LoadingOverlay visible={isLoading || isFetching}></LoadingOverlay>
      </div>
      {isFocus && (
        <Portal.Root>
          <FilterPanel
            initialValues={query}
            onChange={(value) => {
              handleQueryChange(value);
              onChange?.(value);
            }}
          />
        </Portal.Root>
      )}
    </div>
  );
};
