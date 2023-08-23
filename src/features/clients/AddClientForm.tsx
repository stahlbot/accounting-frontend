import { Button, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../user/userSlice";
import { useAppDispatch } from "../../app/hooks";
import { addClient } from "./clientsSlice";

const AddClientForm = ({ close }) => {
  const dispatch = useAppDispatch();
  const form = useForm({
    initialValues: {
      name: "",
      number: "",
      clerk: "",
    },
  });

  const submit = form.onSubmit(async ({ name, number, clerk }) => {
    await dispatch(addClient({ name, number, clerk })).unwrap();
    // console.log(client);
    close();
  });

  const users = useSelector(selectAllUsers).map((user) => ({
    value: user.id,
    label: user.username,
  }));

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
        label="Clerk"
        placeholder="Clerk"
        searchable
        nothingFound="No options"
        data={users}
        {...form.getInputProps("clerk")}
        required
      />
      <Button type="submit" mt={"md"} fullWidth>
        Save
      </Button>
    </form>
  );
};

export default AddClientForm;
