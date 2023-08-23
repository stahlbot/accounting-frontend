import { ActionIcon, Button, Checkbox, Flex, Table, rem } from "@mantine/core";
import { EntityId } from "@reduxjs/toolkit";
import { useState } from "react";
import { Plus, Trash } from "tabler-icons-react";

interface Props {
  columns: {
    accessorkey: string;
    header: string;
  }[];
  RowTemplate: React.ComponentType<{ id: EntityId; children }>;
  data: EntityId[];
  onDelete?: Function;
  onAdd?: Function;
}

const PowerTable = ({ columns, RowTemplate, data, onDelete, onAdd }: Props) => {
  const [selection, setSelection] = useState<EntityId[]>([]);
  const toggleRow = (id: EntityId) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data));

  const rows = data.map((id) => (
    <RowTemplate key={id} id={id}>
      <td>
        <Checkbox
          checked={selection.includes(id)}
          onChange={() => toggleRow(id)}
          transitionDuration={0}
        />
      </td>
    </RowTemplate>
  ));

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
            <th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={
                  selection.length > 0 && selection.length !== data.length
                }
                transitionDuration={0}
              />
            </th>
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
