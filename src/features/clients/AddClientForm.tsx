import { Button, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addClient, editClient, selectClientById } from "./clientsSlice";

interface Props {
  close: Function;
  clientId?: string;
}

const AddClientForm = ({ close, clientId }: Props) => {
  const dispatch = useAppDispatch();
  let form;
  let client;
  if (!clientId) {
    form = useForm({
      initialValues: {
        name: "",
        number: "",
        clerk: "",
      },
    });
  } else {
    client = useAppSelector((state) => selectClientById(state, clientId));
    form = useForm({
      initialValues: { ...client },
    });
  }

  const submit = form.onSubmit(async ({ name, number, clerk }) => {
    if (!clientId) {
      await dispatch(addClient({ name, number, clerk })).unwrap();
    } else {
      await dispatch(
        editClient({ id: clientId, changes: { name, number, clerk } })
      ).unwrap();
    }
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
