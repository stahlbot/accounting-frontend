import { Table } from "@mantine/core";
import { EntityId } from "@reduxjs/toolkit";

interface Props {
  columns: {
    accessorkey: string;
    header: string;
  }[];
  RowTemplate: React.ComponentType<{ id: EntityId }>;
  data: EntityId[];
}

const PowerTable = ({ columns, RowTemplate, data }: Props) => {
  const rows = data.map((id) => <RowTemplate key={id} id={id} />);

  return (
    <Table>
      <thead>
        <tr key="header">
          {columns.map((column) => (
            <th key={column.accessorkey}> {column.header} </th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default PowerTable;
