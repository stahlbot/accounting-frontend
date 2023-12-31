import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  Flex,
  Group,
  Table,
  TextInput,
  UnstyledButton,
  createStyles,
  Text,
  rem,
  Divider,
  Tooltip,
} from "@mantine/core";
import { EntityId } from "@reduxjs/toolkit";
import { ReactNode, useState } from "react";
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
  RowTemplate: React.ComponentType<{ id: string; children }>;
  data: string[];
  title?: string;
  onDelete?: Function;
  onAdd?: Function;
  onOpen?: Function;
  onEdit?: Function;
  setSortBy?: Function;
  sortBy?: string;
  search?: string;
  setSearch?: Function;
  noSelect?: boolean;
}

const PowerTable = ({
  columns,
  RowTemplate,
  data,
  title,
  onDelete,
  onAdd,
  onOpen,
  onEdit,
  setSortBy,
  sortBy,
  search,
  setSearch,
  noSelect,
}: Props) => {
  const { classes, cx } = useStyles();
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
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

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy!(field);
    // setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch!(value);
    // setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const renderActionRow: boolean = Boolean(
    !noSelect || onOpen || onEdit || onDelete || onAdd
  );

  const rows = (reverseSortDirection ? [...data].reverse() : data).map((id) => (
    <RowTemplate key={id} id={id}>
      {renderActionRow && (
        <td>
          <Flex gap={"sm"} justify="center" align={"center"}>
            {!noSelect && (
              <Checkbox
                checked={selection.includes(id)}
                onChange={() => toggleRow(id)}
                transitionDuration={0}
                size="sm"
              />
            )}
            {onOpen && (
              <Tooltip label="Open">
                <ActionIcon
                  variant="default"
                  size="sm"
                  onClick={() => onOpen(id)}
                >
                  <Link />
                </ActionIcon>
              </Tooltip>
            )}
            {onEdit && (
              <Tooltip label="Edit">
                <ActionIcon
                  variant="default"
                  size="sm"
                  onClick={() => onEdit(id)}
                >
                  <Edit />
                </ActionIcon>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip label="Delete">
                <ActionIcon
                  variant="default"
                  size="sm"
                  onClick={() => onDelete(id)}
                >
                  <Trash />
                </ActionIcon>
              </Tooltip>
            )}
          </Flex>
        </td>
      )}
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
        <Text fz={30} fw={700}>
          {title}
        </Text>

        {setSearch && (
          <TextInput
            placeholder="Search by any field"
            // mb="md"
            icon={<IconSearch size="0.9rem" stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
        )}
      </Flex>
      {/* <Divider my="sm" /> */}
      <Table highlightOnHover withBorder withColumnBorders striped>
        <thead className={cx(classes.header)}>
          <tr key="header">
            {renderActionRow && (
              <th style={{ width: rem(40) }}>
                <Flex gap={"sm"} justify="left" align={"center"}>
                  {!noSelect && (
                    <Checkbox
                      onChange={toggleAll}
                      checked={selection.length === data.length}
                      indeterminate={
                        selection.length > 0 && selection.length !== data.length
                      }
                      transitionDuration={0}
                    />
                  )}
                  {onAdd && (
                    <Tooltip label="Add New">
                      <ActionIcon
                        variant="default"
                        size={"sm"}
                        onClick={() => onAdd()}
                      >
                        <Plus />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  {onDelete && (
                    <Tooltip label="Delete Selected">
                      <ActionIcon
                        variant="default"
                        size={"sm"}
                        color="red"
                        onClick={() => deleteSelected()}
                      >
                        <Trash />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Flex>
              </th>
            )}
            {columns.map((column) => (
              <Th
                sorted={sortBy === column.accessorkey}
                onSort={() => setSorting(column.accessorkey)}
                reversed={reverseSortDirection}
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
  const { classes, cx } = useStyles();
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

  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },
}));

export default PowerTable;
