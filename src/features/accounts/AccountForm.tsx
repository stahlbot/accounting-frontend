import { useForm } from "@mantine/form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button, TextInput, Checkbox } from "@mantine/core";
import {
  addAccountTemplate,
  editAccountTemplate,
  selectAccountById,
} from "./accountsSlice";

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

  const form = useForm({
    initialValues: {
      name: "",
      number: "",
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
    async ({ name, number, nonDeductibleTax, accountChart }) => {
      if (!accountId) {
        await dispatch(
          addAccountTemplate({
            name,
            number,
            nonDeductibleTax,
            accountChart,
          })
        ).unwrap();
      } else {
        await dispatch(
          editAccountTemplate({
            id: accountId,
            changes: { name, number, nonDeductibleTax, accountChart },
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
