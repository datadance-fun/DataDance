import {
  ListColumnValuesResponse,
  ListColumnValuesResponseValueKindEnum,
} from "@/api";
import React, { useMemo } from "react";
import { capitalize } from "lodash";
import { MultiSelect } from "../Compact/MultiSelect";
import { RangeSlider, Space, Text } from "@mantine/core";
import { formatTime } from "@/utils/format";

export interface FieldValueProps {
  column: ListColumnValuesResponse;
  onChange: (value: any) => void;
  value?: any;
}

export const FieldValueSelect: React.FC<FieldValueProps> = ({
  column,
  onChange,
  value,
}) => {
  const { value_kind, quantitive_info, temporal_info, categorical_info } =
    column;

  const renderSlider = (
    min: number,
    max: number,
    labelFormatter?: (n: number) => React.ReactNode
  ) => {
    return (
      <div>
        <Text size="xs">
          Min: {labelFormatter ? labelFormatter(value?.min) : value?.min}
        </Text>
        <Text size="xs">
          Max: {labelFormatter ? labelFormatter(value?.max) : value?.max}
        </Text>
        <RangeSlider
          size="xs"
          defaultValue={[min || 0, max || 0]}
          value={[value?.min || min, value?.max || max]}
          minRange={max - min === 0 ? 0.1 : 1}
          onChange={(values) => {
            onChange({
              kind: `min_max_${value_kind}`,
              min: values[0],
              max: values[1],
            });
          }}
          label={labelFormatter}
          min={min}
          max={max}
        ></RangeSlider>
      </div>
    );
  };

  const multiSelectOpt = useMemo(() => {
    if (!categorical_info) {
      return [];
    }
    return categorical_info.values.map((value) => {
      return {
        label: capitalize(value),
        value,
      };
    });
  }, [categorical_info]);

  const renderSelect = () => {
    if (
      value_kind === ListColumnValuesResponseValueKindEnum.Categorical &&
      categorical_info
    ) {
      console.log("renderSelect", value);
      const oneOf = value?.one_of ?? new Set();
      const val =
        oneOf instanceof Set
          ? oneOf
          : Array.isArray(oneOf)
          ? new Set(oneOf)
          : value;
      return (
        <MultiSelect
          onChange={(value) => {
            if (typeof value === "object" && value.constructor === Set) {
              onChange({
                one_of: Array.from(value),
                kind: "one_of",
              });
            } else {
              console.log("Unexpected MultiSelect value", value);
              onChange({
                one_of: [],
                kind: "one_of",
              });
            }
          }}
          value={val}
          options={multiSelectOpt}
        />
      );
    }
    if (
      value_kind === ListColumnValuesResponseValueKindEnum.Quantitive &&
      quantitive_info
    ) {
      return renderSlider(quantitive_info.min, quantitive_info.max);
    }
    if (
      value_kind === ListColumnValuesResponseValueKindEnum.Temporal &&
      temporal_info
    ) {
      return renderSlider(
        temporal_info.min_timestamp_ms,
        temporal_info.max_timestamp_ms,
        (n) => formatTime(n)
      );
    }
    return null;
  };

  return <div>{renderSelect()}</div>;
};
