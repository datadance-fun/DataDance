import {
  DataColumn,
  DataColumnDataTypeEnum,
  QueryDimensionNonCountOptionsTemporalValueFunctionEnum,
} from "@/api";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { useControllableValue, useMemoizedFn } from "ahooks";
import { orderBy } from "lodash";
import { useMemo } from "react";
import { DropdownPrimitive } from "../Compact/DropdownPrimitive";
import { ISelectOption, ISelectProps, Select } from "../Compact/Select";
import { ColumnTypeIcon } from "../Icon";

export interface IFieldSelectProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "placeholder" | "onChange" | "value" | "defaultValue"
  > {
  columns?: Array<DataColumn>;
  value?: FieldSelectValue;
  defaultValue?: FieldSelectValue;
  onChange?: (value: FieldSelectValue) => void;
}

export type FieldSelectValue = {
  column_name: string;
  column_type: string;
  temporal_value_function?: QueryDimensionNonCountOptionsTemporalValueFunctionEnum;
};

export function FieldSelect(props: IFieldSelectProps) {
  const { columns, value, defaultValue, onChange, ...restProps } = props;
  const [state, setState] = useControllableValue<FieldSelectValue>(props);

  const orderedColumns = useMemo(() => {
    return orderBy(columns ?? [], ["name", "data_type"]);
  }, [columns]);

  const columnTypeByName = useMemo(() => {
    const map: Record<string, DataColumnDataTypeEnum> = {};
    columns?.forEach((column) => {
      map[column.name] = column.data_type;
    });
    return map;
  }, [columns]);

  const handleFieldChange = useMemoizedFn((column_name: string) => {
    setState({
      column_name,
      column_type: columnTypeByName[column_name],
      // when changing fields, project fn is not preserved
      temporal_value_function: undefined,
    });
  });

  const handleTemporalFnChange = useMemoizedFn(
    (column_name: string, fn_name: string) => {
      const temporal_value_function =
        fn_name === ""
          ? undefined
          : (fn_name as QueryDimensionNonCountOptionsTemporalValueFunctionEnum);
      setState({
        column_name,
        column_type: columnTypeByName[column_name],
        temporal_value_function,
      });
    }
  );

  function renderDisplayValue() {
    if (!state) {
      return "";
    }
    let name = <>{state.column_name}</>;
    if (state.temporal_value_function) {
      name = (
        <>
          <span className="font-bold text-orange-500">
            {state.temporal_value_function.toUpperCase()}(
          </span>
          {name}
          <span className="font-bold text-orange-500">)</span>
        </>
      );
    }
    return name;
  }

  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger {...restProps}>
        <ColumnTypeIcon
          dataType={columnTypeByName[state?.column_name ?? ""]}
          className="mr-2 opacity-50"
        />
        {renderDisplayValue()}
      </DropdownPrimitive.Trigger>
      <DropdownPrimitive.Content>
        <DropdownPrimitive.RadioGroup
          value={state?.column_name}
          onValueChange={handleFieldChange}
        >
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
                    {Boolean(column.name === state?.column_name) && (
                      <DropdownPrimitive.IndicatorContainer>
                        <DotFilledIcon />
                      </DropdownPrimitive.IndicatorContainer>
                    )}
                  </DropdownPrimitive.SubTrigger>
                  <DropdownPrimitive.SubContent>
                    <DropdownPrimitive.RadioGroup
                      value={
                        column.name === state?.column_name
                          ? state?.temporal_value_function ?? ""
                          : undefined
                      }
                      onValueChange={(fn_name) =>
                        handleTemporalFnChange(column.name, fn_name)
                      }
                    >
                      <DropdownPrimitive.RadioItem value="">
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
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Root>
  );
}
