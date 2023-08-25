import { useForm } from "@mantine/form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addCategory,
  editCategory,
  selectCategoryById,
} from "./categoriesSlice";
import { Button, TextInput, Checkbox, Select } from "@mantine/core";

interface Props {
  close: Function;
  categoryId?: string;
}

export const CategoryForm = ({ close, categoryId }: Props) => {
  const dispatch = useAppDispatch();

  const category = useAppSelector((state) =>
    selectCategoryById(state, categoryId!)
  );

  const form = useForm({
    initialValues: {
      name: "",
      document: "",
      ...category,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  const submit = form.onSubmit(async ({ name, document }) => {
    if (!categoryId) {
      await dispatch(addCategory({ name, document })).unwrap();
    } else {
      await dispatch(
        editCategory({ id: categoryId, changes: { name, document } })
      ).unwrap();
    }
    close();
  });

  return (
    <form onSubmit={submit}>
      <TextInput
        placeholder="Name"
        label="Name"
        {...form.getInputProps("name")}
        required
      />

      <Select
        label="Document Type"
        placeholder="Pick one"
        data={[
          { value: "BA", label: "Balance" },
          { value: "PL", label: "Profit and Loss" },
        ]}
        {...form.getInputProps("document")}
        required
      />
      <Button type="submit" mt={"md"} fullWidth>
        Save
      </Button>
    </form>
  );
};
