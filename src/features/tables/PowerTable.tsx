import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  Flex,
  Group,
  Table,
  UnstyledButton,
  createStyles,
  rem,
} from "@mantine/core";
import { EntityId } from "@reduxjs/toolkit";
import { useState } from "react";
import { Link, Edit, Plus, Trash } from "tabler-icons-react";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";

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
  setSortBy?: Function;
  sortBy?: string;
}

const PowerTable = ({
  columns,
  RowTemplate,
  data,
  onDelete,
  onAdd,
  onOpen,
  onEdit,
  setSortBy,
  sortBy,
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
              <Th
                sorted={sortBy === column.accessorkey}
                onSort={() => setSortBy!(column.accessorkey)}
                key={column.accessorkey}
                sortBy={sortBy} // if sortBy is not set, then sortbuttons not rendered
              >
                {" "}
                {column.header}{" "}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};

interface ThProps {
  children: React.ReactNode;
  reversed?: boolean;
  sorted: boolean;
  onSort(): void;
  sortBy?: string;
}

function Th({ children, reversed, sorted, onSort, sortBy }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      {sortBy && (
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="apart">
            {/* <Text  */}
            {/* // fw={500} fz="sm" */}
            {/* > */}
            {children}
            {/* </Text> */}
            <Center className={classes.icon}>
              <Icon
                // size="sm"
                stroke={1.5}
              />
            </Center>
          </Group>
        </UnstyledButton>
      )}
      {!sortBy && children}
    </th>
  );
}

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },
}));

export default PowerTable;
