import { useForm } from "@mantine/form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button, TextInput, Checkbox, Select } from "@mantine/core";
import {
  addAccountTemplate,
  editAccountTemplate,
  selectAccountById,
} from "./accountsSlice";
import { selectAllCategories } from "../categories/categoriesSlice";

interface Props {
  close: Function;
  accountId?: string;
  accountChart: string;
}

export const AccountForm = ({ close, accountId, accountChart }: Props) => {
  const dispatch = useAppDispatch();

  const account = useAppSelector((state) =>
    selectAccountById(state, accountId!)
  );

  const categories = useAppSelector(selectAllCategories);

  const dataSelect = categories.map((category) => {
    return {
      value: category.id,
      label: `${category?.document}: ${category?.name}`,
    };
  });

  const form = useForm({
    initialValues: {
      name: "",
      number: "",
      category: "",
      nonDeductibleTax: false,
      accountChart,
      ...account,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  const submit = form.onSubmit(
    async ({ name, number, category, nonDeductibleTax, accountChart }) => {
      if (!accountId) {
        await dispatch(
          addAccountTemplate({
            name,
            number,
            category,
            nonDeductibleTax,
            accountChart,
          })
        ).unwrap();
      } else {
        await dispatch(
          editAccountTemplate({
            id: accountId,
            changes: { name, number, category, nonDeductibleTax, accountChart },
          })
        ).unwrap();
      }
      close();
    }
  );

  return (
    <form onSubmit={submit}>
      <TextInput
        placeholder="Name"
        label="Name"
        {...form.getInputProps("name")}
        required
      />

      <TextInput
        placeholder="Number"
        label="Number"
        {...form.getInputProps("number")}
        required
      />
      <Select
        placeholder="Select Category"
        label="category"
        data={dataSelect}
        {...form.getInputProps("category")}
        required
        searchable
      />
      <Checkbox
        label="Non Deductible tax"
        {...form.getInputProps("nonDeductibleTax")}
      />
      <Button type="submit" mt={"md"} fullWidth>
        Save
      </Button>
    </form>
  );
};
