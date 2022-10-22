import { DataResult } from "@/api";
import { CrumpledPaperIcon } from "@radix-ui/react-icons";
import { ColumnTypeIcon } from "../Icon";
import { SpinnerIcon } from "../SpinnerIcon";

export interface IDataTableDataProps {
  data?: DataResult;
  isLoading?: boolean;
}

export function DataTable({ data, isLoading }: IDataTableDataProps) {
  if (!data) {
    return (
      <div className="bg-white rounded border border-gray-200 py-20 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center mb-4">
          {isLoading && (
            <SpinnerIcon className="w-12 h-12 text-slate-100 animate-spin fill-rose-500" />
          )}
          {!isLoading && (
            <CrumpledPaperIcon className="w-12 h-12 text-slate-300" />
          )}
        </div>
        {isLoading && <div>Loading data preview...</div>}
        {!isLoading && (
          <div>No data to preview. Start by selecting a data set.</div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-full rounded border border-gray-200">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr className="divide-x divide-gray-200">
            {data.columns.map((col) => (
              <th
                key={col.name}
                className="sticky top-0 bg-opacity-75 border-b border-gray-200 bg-gray-50 backdrop-blur backdrop-filter z-10 whitespace-nowrap text-left text-xs font-semibold text-gray-700"
              >
                <div className="inline-flex items-center px-1.5 py-1.5">
                  <ColumnTypeIcon dataType={col.data_type} className="mr-1" />
                  {col.name.toUpperCase()}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.rows.map((row, idx) => (
            <tr key={idx} className="divide-x divide-gray-200">
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className="whitespace-nowrap px-1.5 py-1.5 text-xs text-gray-700"
                >
                  {cell as any}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
