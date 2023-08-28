import { useNavigate } from "react-router-dom";
import PowerTable from "../tables/PowerTable";
import { CategoryRow } from "./CategoryRow";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteCategory, selectCategoryIdsSortedBy } from "./categoriesSlice";
import { useState } from "react";
import { CategoryForm } from "./categoryForm";

export const CategoryTable = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);
  const [categoryEdited, setCategoryEdited] = useState<string>("");

  const [categorySortBy, setCategorySortBy] = useState<string>("name");
  const categories = useAppSelector((state) =>
    selectCategoryIdsSortedBy(state, categorySortBy)
  );

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
        title="Account Categories"
        setSortBy={setCategorySortBy}
        sortBy={categorySortBy}
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
