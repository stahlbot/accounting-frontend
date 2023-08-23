import ClientRow from "./ClientRow";
import { useSelector } from "react-redux";
import { fetchClients, selectClientIds } from "./clientsSlice";
import { useAppDispatch } from "../../app/hooks";
import { useEffect } from "react";
import PowerTable from "../tables/PowerTable";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import AddClientForm from "./AddClientForm";

const ClientsPage = () => {
  // const rows =
  const dispatch = useAppDispatch();
  const clients = useSelector(selectClientIds);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    dispatch(fetchClients());
  });

  const columns = [
    { accessorkey: "clientName", header: "Name" },
    { accessorkey: "clientNumber", header: "Number" },
    { accessorkey: "created_at", header: "Created At" },
    { accessorkey: "clerk", header: "Clerk" },
  ];

  const onDelete = () => {
    console.log("delete");
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Client">
        <AddClientForm close={close} />
      </Modal>
      <PowerTable
        columns={columns}
        RowTemplate={ClientRow}
        data={clients}
        onDelete={onDelete}
        onAdd={open}
      ></PowerTable>
    </>
  );
};

export default ClientsPage;
