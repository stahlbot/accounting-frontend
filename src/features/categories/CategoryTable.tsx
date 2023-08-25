import { useNavigate } from "react-router-dom";
import PowerTable from "../tables/PowerTable";
import { CategoryRow } from "./CategoryRow";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAppDispatch } from "../../app/hooks";
import { deleteCategory } from "./categoriesSlice";
import { useState } from "react";
import { CategoryForm } from "./categoryForm";

export const CategoryTable = ({ categories, sortBy, setSortBy }) => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);
  const [categoryEdited, setCategoryEdited] = useState<string>("");

  const columns = [
    { accessorkey: "name", header: "Name" },
    { accessorkey: "document", header: "Document" },
  ];

  // const onOpen = (id) => {
  //   navigate(`/settings/account-charts/${id}`);
  // };

  const onEdit = (id) => {
    setCategoryEdited(id);
    open();
  };

  const onDelete = async (id) => {
    await dispatch(deleteCategory(id)).unwrap();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Account Chart Template">
        <CategoryForm close={close} categoryId={categoryEdited} />
      </Modal>
      <PowerTable
        columns={columns}
        RowTemplate={CategoryRow}
        data={categories}
        title="Account Charts"
        setSortBy={setSortBy}
        sortBy={sortBy}
        // onOpen={onOpen}
        onAdd={() => {
          open();
          setCategoryEdited("");
        }}
        onEdit={onEdit}
        onDelete={onDelete}
      ></PowerTable>
    </>
  );
};
