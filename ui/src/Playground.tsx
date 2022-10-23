import { Stack } from "@mantine/core";
import { MixIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { DataSource, QueryDimension } from "./api";
import { MultiSelect } from "./components/Compact/MultiSelect";
import { Select } from "./components/Compact/Select";
import { DataTable } from "./components/DataTable";
import {
  AxisOptionSelect,
  AxisOptionValue,
} from "./components/Filter/AxisOptionSelect";
import { DataSourceSelect } from "./components/Filter/DataSourceSelect";
import { DimensionSelect } from "./components/Filter/DimensionSelect";
import { FieldSelect, FieldSelectValue } from "./components/Filter/FieldSelect";

import dataTableData from "./Playground.DataTable.json";

export function PlaygroundPage() {
  const [valueAxisOption, setValueAxisOption] = useState<
    AxisOptionValue | undefined
  >();
  const [valueSelect, setValueSelect] = useState<string | undefined>();
  const [valueMultiSelect, setValueMultiSelect] = useState<
    Set<string> | undefined
  >();
  const [valueDimensionSelect, setValueDimensionSelect] = useState<
    QueryDimension | undefined
  >();
  const [valueFieldSelect, setValueFieldSelect] = useState<
    FieldSelectValue | undefined
  >();
  const [valueDataSource, setValueDataSource] = useState<
    DataSource | undefined
  >();
  return (
    <div>
      <div className="bg-slate-100 pt-16 h-screen px-[100px]">
        <Stack spacing="lg">
          <div>
            <div>AxisOptionSelect</div>
            <AxisOptionSelect
              value={valueAxisOption}
              onChange={setValueAxisOption}
            />
            <div>{JSON.stringify(valueAxisOption)}</div>
          </div>
          <div>
            <div>Select</div>
            <Select
              value={valueSelect}
              onChange={setValueSelect}
              placeholder="Select X"
              options={[
                { value: "jack" },
                { value: "foo" },
                { value: "car", disabled: true },
                {
                  value: "box",
                  label: (
                    <div className="flex items-center gap-x-2">
                      Box <MixIcon />
                    </div>
                  ),
                },
              ]}
            />
            <div>{JSON.stringify(valueSelect)}</div>
          </div>
          <div>
            <div>MultiSelect</div>
            <MultiSelect
              value={valueMultiSelect}
              onChange={setValueMultiSelect}
              placeholder="Select X, Y"
              options={[
                { value: "jack" },
                { value: "foo" },
                { value: "car", disabled: true },
                {
                  value: "box",
                  label: (
                    <div className="flex items-center gap-x-2">
                      Box <MixIcon />
                    </div>
                  ),
                },
              ]}
              className="w-full"
            />
            <div>{JSON.stringify(valueMultiSelect)}</div>
          </div>
          <div>
            <div>DimensionSelect</div>
            <DimensionSelect
              value={valueDimensionSelect}
              onChange={setValueDimensionSelect}
              columns={[
                { name: "year", data_type: "int" },
                { name: "date", data_type: "datetime" },
                { name: "country", data_type: "string" },
                { name: "count", data_type: "int" },
                { name: "update_at", data_type: "datetime" },
              ]}
            />
            <div>{JSON.stringify(valueDimensionSelect)}</div>
          </div>
          <div>
            <div>FieldSelect</div>
            <FieldSelect
              value={valueFieldSelect}
              onChange={setValueFieldSelect}
              columns={[
                { name: "year", data_type: "int" },
                { name: "date", data_type: "datetime" },
                { name: "country", data_type: "string" },
                { name: "count", data_type: "int" },
                { name: "update_at", data_type: "datetime" },
              ]}
            />
            <div>{JSON.stringify(valueFieldSelect)}</div>
          </div>
          <div>
            <div>DataSourceSelect</div>
            <DataSourceSelect
              value={valueDataSource}
              onChange={setValueDataSource}
            />
            <div>{JSON.stringify(valueDataSource)}</div>
          </div>
          <div>
            <div>DataTable Empty</div>
            <DataTable />
            <div>DataTable</div>
            <div className="h-[400px]">
              <DataTable data={dataTableData as any} />
            </div>
          </div>
        </Stack>
      </div>
    </div>
  );
}
