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
  // let form;
  // let client;
  const client = useAppSelector((state) => selectClientById(state, clientId!));

  // if (!clientId) {
  const form = useForm({
    initialValues: {
      name: "",
      number: "",
      clerk: "",
      accountChart: "",
      ...client,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      number: (value) =>
        /^\d{5}$/.test(value) ? null : "Number must contain exactly 5 digits",
    },
  });
  // } else {
  //   form = useForm({
  //     initialValues: { ...client },
  //   });
  // }

  const submit = form.onSubmit(
    async ({ name, number, clerk, accountChart }) => {
      if (!clientId) {
        await dispatch(
          addClient({ name, number, clerk, accountChart })
        ).unwrap();
      } else {
        await dispatch(
          editClient({
            id: clientId,
            changes: { name, number, clerk, accountChart },
          })
        ).unwrap();
      }
      // console.log(client);
      close();
    }
  );

  const users = useSelector(selectAllUsers).map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.last_name}`,
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
