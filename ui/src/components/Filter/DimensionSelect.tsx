import cx from "classnames";
import {
  DataColumn,
  DataColumnDataTypeEnum,
  QueryDimension,
  QueryDimensionNonCountOptionsAggregationFunctionEnum,
  QueryDimensionNonCountOptionsTemporalValueFunctionEnum,
} from "@/api";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { useControllableValue, useMemoizedFn } from "ahooks";
import { orderBy } from "lodash";
import { useMemo } from "react";
import { DropdownPrimitive } from "../Compact/DropdownPrimitive";
import { ColumnTypeIcon } from "../Icon";

export interface IDimensionSelectProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  columns?: Array<DataColumn>;
  value?: QueryDimension;
  defaultValue?: QueryDimension;
  onChange?: (value: QueryDimension) => void;
}

const COLUMN_NAME_VALUE_COUNT = "$$COUNT$$";

export function DimensionSelect(props: IDimensionSelectProps) {
  const { columns, value, defaultValue, onChange, ...restProps } = props;

  const [state, setState] = useControllableValue<QueryDimension | null>(props, {
    defaultValue: null,
  });

  const orderedColumns = useMemo(() => {
    return orderBy(columns ?? [], ["name", "data_type"]);
  }, [columns]);

  const columnTypeByName = useMemo(() => {
    const map: Record<string, DataColumnDataTypeEnum> = {};
    columns?.forEach((column) => {
      map[column.name] = column.data_type;
    });
    map[COLUMN_NAME_VALUE_COUNT] = "int";
    return map;
  }, [columns]);

  const fieldValue = useMemo(() => {
    if (!state) return "";
    if (state.is_count) {
      return COLUMN_NAME_VALUE_COUNT;
    }
    const opt = state.non_count_options;
    if (!opt) {
      return "";
    }
    return opt.column_name ?? "";
  }, [state]);

  const temporalFieldValue = useMemo(() => {
    if (!state) return undefined;
    if (state.is_count) {
      return undefined;
    }
    if (!state.non_count_options) {
      return undefined;
    }
    return state.non_count_options.temporal_value_function ?? "";
  }, [state]);

  const handleFieldChange = useMemoizedFn((column_name: string) => {
    setState((state) => {
      if (column_name === COLUMN_NAME_VALUE_COUNT) {
        return { is_count: true };
      } else {
        return {
          is_count: false,
          non_count_options: {
            column_name,
            // when changing fields, project fn is not preserved
            temporal_value_function: undefined,
            // when changing fields, aggr fn is not preserved, because different fields may support different aggr fn
            aggregation_function: undefined,
          },
        };
      }
    });
  });

  const handleTemporalFnChange = useMemoizedFn(
    (column_name: string, fn_name: string) => {
      setState((state) => {
        const temporal_value_function =
          fn_name === ""
            ? undefined
            : (fn_name as QueryDimensionNonCountOptionsTemporalValueFunctionEnum);
        let aggregation_function =
          state?.non_count_options?.aggregation_function;
        if (state?.non_count_options?.column_name !== column_name) {
          // when changing fields, aggr fn is not preserved, because different fields may support different aggr fn
          aggregation_function = undefined;
        }
        return {
          is_count: false,
          non_count_options: {
            column_name,
            temporal_value_function,
            aggregation_function,
          },
        };
      });
    }
  );

  const handleAggrFnChange = useMemoizedFn((fn_name: string) => {
    setState((state) => {
      if (state?.is_count) {
        // COUNT does not allow aggregation functions
        return state;
      }
      const aggregation_function =
        fn_name === ""
          ? undefined
          : (fn_name as QueryDimensionNonCountOptionsAggregationFunctionEnum);
      return {
        is_count: false,
        non_count_options: {
          column_name: state?.non_count_options?.column_name ?? "",
          temporal_value_function:
            state?.non_count_options?.temporal_value_function,
          aggregation_function,
        },
      };
    });
  });

  const aggregationValue = useMemo(() => {
    if (state?.is_count) {
      return "";
    }
    return state?.non_count_options?.aggregation_function ?? "";
  }, [state]);

  function renderDisplayValue() {
    if (!state) {
      return "";
    }
    if (state.is_count) {
      return "COUNT";
    }
    const opt = state.non_count_options;
    if (!opt) {
      return "";
    }
    let name = <>{opt.column_name}</>;
    if (opt.temporal_value_function) {
      name = (
        <>
          <span className="font-bold text-orange-500">
            {opt.temporal_value_function.toUpperCase()}(
          </span>
          {name}
          <span className="font-bold text-orange-500">)</span>
        </>
      );
    }
    if (opt.aggregation_function) {
      name = (
        <>
          <span className="font-bold text-green-500 ">
            {opt.aggregation_function.toUpperCase()}(
          </span>
          {name}
          <span className="font-bold text-green-500">)</span>
        </>
      );
    }
    return name;
  }

  const handleSelectDoNotClose = useMemoizedFn((ev: Event) => {
    ev.preventDefault();
  });

  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger {...restProps}>
        <ColumnTypeIcon
          dataType={columnTypeByName[fieldValue]}
          className="mr-2 opacity-50"
        />
        {renderDisplayValue()}
      </DropdownPrimitive.Trigger>
      <DropdownPrimitive.Content>
        <DropdownPrimitive.RadioGroup
          value={fieldValue}
          onValueChange={handleFieldChange}
        >
          <DropdownPrimitive.RadioItem
            value={COLUMN_NAME_VALUE_COUNT}
            onSelect={handleSelectDoNotClose}
          >
            <ColumnTypeIcon dataType="int" className="mr-2 opacity-50" />
            COUNT
          </DropdownPrimitive.RadioItem>
          <DropdownPrimitive.Separator />
          {orderedColumns.map((column) => {
            if (column.data_type === "datetime") {
              return (
                <DropdownPrimitive.Sub key={column.name}>
                  <DropdownPrimitive.SubTrigger>
                    <ColumnTypeIcon
                      dataType={column.data_type}
                      className="mr-2 opacity-50"
                    />
                    {column.name}
                    {Boolean(column.name === fieldValue) && (
                      <DropdownPrimitive.IndicatorContainer>
                        <DotFilledIcon />
                      </DropdownPrimitive.IndicatorContainer>
                    )}
                  </DropdownPrimitive.SubTrigger>
                  <DropdownPrimitive.SubContent>
                    <DropdownPrimitive.RadioGroup
                      value={
                        column.name === fieldValue
                          ? temporalFieldValue
                          : undefined
                      }
                      onValueChange={(fn_name) =>
                        handleTemporalFnChange(column.name, fn_name)
                      }
                    >
                      <DropdownPrimitive.RadioItem
                        value=""
                        onSelect={handleSelectDoNotClose}
                      >
                        {column.name}
                      </DropdownPrimitive.RadioItem>
                      <DropdownPrimitive.Separator />
                      <DropdownPrimitive.Label>
                        Transform
                      </DropdownPrimitive.Label>
                      {Object.values(
                        QueryDimensionNonCountOptionsTemporalValueFunctionEnum
                      ).map((fn_name) => {
                        return (
                          <DropdownPrimitive.RadioItem
                            key={fn_name}
                            value={fn_name}
                            onSelect={handleSelectDoNotClose}
                          >
                            <span className="text-orange-500">
                              {fn_name.toUpperCase()}(
                            </span>
                            {column.name}
                            <span className="text-orange-500">)</span>
                          </DropdownPrimitive.RadioItem>
                        );
                      })}
                    </DropdownPrimitive.RadioGroup>
                  </DropdownPrimitive.SubContent>
                </DropdownPrimitive.Sub>
              );
            } else {
              return (
                <DropdownPrimitive.RadioItem
                  value={column.name}
                  key={column.name}
                  onSelect={handleSelectDoNotClose}
                >
                  <ColumnTypeIcon
                    dataType={column.data_type}
                    className="mr-2 opacity-50"
                  />{" "}
                  {column.name}
                </DropdownPrimitive.RadioItem>
              );
            }
          })}
        </DropdownPrimitive.RadioGroup>
        <DropdownPrimitive.Separator />
        <DropdownPrimitive.Label>Aggregation</DropdownPrimitive.Label>
        <DropdownPrimitive.RadioGroup
          value={aggregationValue}
          onValueChange={handleAggrFnChange}
        >
          <DropdownPrimitive.RadioItem
            key={""}
            value={""}
            onSelect={handleSelectDoNotClose}
          >
            None
          </DropdownPrimitive.RadioItem>
          {Object.values(
            QueryDimensionNonCountOptionsAggregationFunctionEnum
          ).map((fn_name) => {
            return (
              <DropdownPrimitive.RadioItem
                key={fn_name}
                value={fn_name}
                onSelect={handleSelectDoNotClose}
                disabled={fieldValue === COLUMN_NAME_VALUE_COUNT}
              >
                <span
                  className={cx({
                    "text-green-500": fieldValue !== COLUMN_NAME_VALUE_COUNT,
                  })}
                >
                  {fn_name.toUpperCase()}()
                </span>
              </DropdownPrimitive.RadioItem>
            );
          })}
        </DropdownPrimitive.RadioGroup>
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Root>
  );
}
