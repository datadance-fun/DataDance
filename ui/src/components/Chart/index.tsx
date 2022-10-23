import { DataColumn, DataResult } from "@/api";
import React from "react";
import {
  PlainObject,
  SignalListeners,
  VegaLite,
  VisualizationSpec,
} from "react-vega";
import { DTable, DTableProps } from "../Table";

// example data
const spec: VisualizationSpec = {
  // width: "container",
  width: 650,
  height: 200,
  autosize: {
    type: "fit",
    contains: "padding",
  },
  mark: "bar",
  encoding: {
    x: { field: "a", type: "ordinal" },
    y: { field: "b", type: "quantitative" },
  },
  data: { name: "table" }, // note: vega-lite data attribute is a plain object instead of an array
  signals: [],
};

const barData = {
  table: [
    { a: "A", b: 28 },
    { a: "B", b: 55 },
    { a: "C", b: 43 },
    { a: "D", b: 91 },
    { a: "E", b: 81 },
    { a: "F", b: 53 },
    { a: "G", b: 19 },
    { a: "H", b: 87 },
    { a: "I", b: 52 },
  ],
};

export const Chart: React.FC<{
  spec: VisualizationSpec;
  data: PlainObject;
  signalListeners?: SignalListeners;
  actions?: boolean;
}> = ({ spec, data, actions = false, signalListeners }) => {
  if (spec.mark === "table") {
    const columns: DTableProps["columns"] = (
      data[spec.data?.name || ""]?.columns || []
    ).map((col: DataColumn, index: number) => {
      return {
        title: spec.encoding[col.name].field,
        render: (row: any[]) => {
          return row?.[index];
        },
      };
    });
    return (
      <div className="max-h-[650px] overflow-scroll scrollbar-hide ">
        <DTable data={data[spec.data?.name].rows} columns={columns} />
      </div>
    );
  }
  return (
    <VegaLite
      spec={spec}
      data={data}
      actions={actions}
      className="vega-container"
      signalListeners={signalListeners}
    ></VegaLite>
  );
};

export const ExpampleChart = () => {
  return <Chart spec={spec} data={barData} actions={false}></Chart>;
};
