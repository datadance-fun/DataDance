import { Table } from "@mantine/core";

interface DColumn<T> {
  title?: React.ReactNode;
  dataIndex?: string;
  render?: (record: T, index: number) => React.ReactNode;
}

export interface DTableProps<T = any> {
  columns: DColumn<T>[];
  loading?: boolean;
  data: T[];
}

export const DTable = <T extends object = {}>({
  columns,
  data,
}: DTableProps<T>) => {
  const rows = data.map((row, index) => {
    const cols = columns.map((col, colIndex) => {
      return (
        <td key={`col-${colIndex}`}>
          {col.render
            ? col.render(row, colIndex)
            : (row as any)[col.dataIndex || ""]}
        </td>
      );
    });
    return <tr key={index}>{cols}</tr>;
  });
  return (
    <Table>
      <thead>
        <tr>
          {columns.map((col, index) => {
            return <th key={index}>{col.title || col.dataIndex}</th>;
          })}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};
