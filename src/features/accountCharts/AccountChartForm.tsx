import { useForm } from "@mantine/form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addAccountChart, selectAccountChartById } from "./accountChartsSlice";
import { Button, TextInput, Checkbox } from "@mantine/core";

interface Props {
  close: Function;
  accountChartId?: string;
}

export const AccountChartForm = ({ close, accountChartId }: Props) => {
  const dispatch = useAppDispatch();

  const accountChart = useAppSelector((state) =>
    selectAccountChartById(state, accountChartId!)
  );

  const form = useForm({
    initialValues: {
      name: "",
      isTemplate: "",
      client: "",
      ...accountChart,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  const submit = form.onSubmit(async ({ name, isTemplate, client }) => {
    if (!accountChartId) {
      await dispatch(addAccountChart({ name, isTemplate, client })).unwrap();
    }
    // else {
    //   await dispatch(
    //     editClient({ id: clientId, changes: { name, number, clerk } })
    //   ).unwrap();
    // }
    // console.log(client);
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

      <Checkbox label="Is a Template" {...form.getInputProps("isTemplate")} />
      <Button type="submit" mt={"md"} fullWidth>
        Save
      </Button>
    </form>
  );
};
