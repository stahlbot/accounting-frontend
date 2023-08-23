import { ActionIcon, Button, Checkbox, Flex, Table, rem } from "@mantine/core";
import { EntityId } from "@reduxjs/toolkit";
import { useState } from "react";
import { Link, Edit, Plus, Trash } from "tabler-icons-react";

interface Props {
  columns: {
    accessorkey: string;
    header: string;
  }[];
  RowTemplate: React.ComponentType<{ id: EntityId; children }>;
  data: EntityId[];
  onDelete?: Function;
  onAdd?: Function;
  onOpen?: Function;
  onEdit?: Function;
}

const PowerTable = ({
  columns,
  RowTemplate,
  data,
  onDelete,
  onAdd,
  onOpen,
  onEdit,
}: Props) => {
  const [selection, setSelection] = useState<EntityId[]>([]);
  const toggleRow = (id: EntityId) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data));

  const deleteSelected = () => {
    selection.forEach((id) => onDelete!(id));
  };

  const rows = data.map((id) => (
    <RowTemplate key={id} id={id}>
      <td>
        <Flex gap={"sm"} justify="center" align={"center"}>
          <Checkbox
            checked={selection.includes(id)}
            onChange={() => toggleRow(id)}
            transitionDuration={0}
            size="sm"
          />
          {onOpen && (
            <ActionIcon variant="default" size="sm" onClick={() => onOpen(id)}>
              <Link />
            </ActionIcon>
          )}
          {onEdit && (
            <ActionIcon variant="default" size="sm" onClick={() => onEdit(id)}>
              <Edit />
            </ActionIcon>
          )}
          {onDelete && (
            <ActionIcon
              variant="default"
              size="sm"
              onClick={() => onDelete(id)}
            >
              <Trash />
            </ActionIcon>
          )}
        </Flex>
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
            onClick={() => deleteSelected()}
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
