import { UseFormReturnType } from "@mantine/form";
import React from "react";
import { Skeleton, Stack } from "@mantine/core";
import { TrashIcon } from "@radix-ui/react-icons";
import { IconButton } from "../Compact/Button";
import { FieldSelect, FieldSelectValue } from "./FieldSelect";
import { DataColumn, DataSource, QueryFilter } from "@/api";
import { useQuery } from "react-query";
import { DefaultClient } from "@/services/client";
import { FieldValueSelect } from "./FieldValueSelect";

export type FilterOption =
  | {
      label: string;
      value: string;
      type: "select";
      placeholder?: string;
      options: { label: string; value: string }[];
    }
  | {
      label: string;
      value: string;
      type: "range";
      labelFormatter?: (value: number) => React.ReactNode;
      min: number;
      max: number;
    }
  | {
      label: string;
      value: string;
      type: "datetime";
      options: { label: string; value: string }[];
    };

export interface FiterValue {
  key: string;
  value?: Set<string> | [number, number] | string;
}

const FetchField: React.FC<{
  column: FieldSelectValue;
  source: DataSource;
  value: any;
  onChange: (value: any) => void;
}> = ({ source, column, value, onChange }) => {
  const { data, isLoading, isFetching } = useQuery(
    ["listValues", source, column.column_name, column.temporal_value_function],
    () => {
      return DefaultClient.API.dataListColumnValues({
        data_source: source,
        column_name: value?.column_name,
        column_type: value?.column_type,
      });
    },
    {
      enabled: !!(column && column.column_name),
    }
  );

  if (data?.data) {
    return (
      <FieldValueSelect column={data.data} value={value} onChange={onChange} />
    );
  }

  console.log("rendering", Math.random());
  if (isFetching || isLoading) {
    return (
      <div>
        <Skeleton height={5} mb={6} />
        <Skeleton height={5} mb={6} />
      </div>
    );
  }

  return null;
};

export const FilterInput = <T extends object = {}>({
  fieldKey,
  form,
  values,
  options,
  source,
}: {
  fieldKey: string;
  values: QueryFilter[];
  options: DataColumn[];
  form: UseFormReturnType<T, any>;
  source: DataSource;
}) => {
  const renderField = (index: number) => {
    const valuekey = `${fieldKey}.${index}`;
    const { value } = form.getInputProps(valuekey);
    const columnName = value && value.column_name;
    const columnType = value && value.column_type;

    const isFilledValue =
      value &&
      typeof value === "object" &&
      ("min" in value || "one_of" in value);
    return (
      <FetchField
        column={value}
        value={value}
        source={source}
        onChange={(newValue) =>
          form.setFieldValue(
            valuekey,
            isFilledValue
              ? {
                  column_name: columnName,
                  column_type: columnType,
                  ...newValue,
                }
              : { ...value, ...newValue }
          )
        }
      ></FetchField>
    );
  };

  const fields = values.map((item, index) => {
    return (
      <Stack key={`${index}`} spacing="xs">
        <div className="flex items-center gap-x-2">
          <FieldSelect
            className="flex-1"
            columns={options}
            {...form.getInputProps(`${fieldKey}.${index}`)}
          />
          <IconButton onClick={() => form.removeListItem(fieldKey, index)}>
            <TrashIcon />
          </IconButton>
        </div>
        {renderField(index)}
      </Stack>
    );
  });
  return <>{fields}</>;
};
