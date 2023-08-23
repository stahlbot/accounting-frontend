import { ActionIcon, Button, Flex, Table } from "@mantine/core";
import { EntityId } from "@reduxjs/toolkit";
import { Plus, Trash } from "tabler-icons-react";

interface Props {
  columns: {
    accessorkey: string;
    header: string;
  }[];
  RowTemplate: React.ComponentType<{ id: EntityId }>;
  data: EntityId[];
  onDelete?: Function;
  onAdd?: Function;
}

const PowerTable = ({ columns, RowTemplate, data, onDelete, onAdd }: Props) => {
  const rows = data.map((id) => <RowTemplate key={id} id={id} />);

  return (
    <>
      <Flex
        gap={"sm"}
        justify="flex-start"
        align="center"
        direction="row"
        wrap="wrap"
      >
        {onDelete && (
          <ActionIcon
            variant="default"
            size={"md"}
            color="red"
            onClick={() => onDelete()}
          >
            <Trash />
          </ActionIcon>
        )}
        {onAdd && (
          <ActionIcon variant="default" size={"md"} onClick={() => onAdd()}>
            <Plus />
          </ActionIcon>
        )}
      </Flex>
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
    </>
  );
};

export default PowerTable;
