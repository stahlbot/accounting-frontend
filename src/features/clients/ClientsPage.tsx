import ClientRow from "./ClientRow";
import { useSelector } from "react-redux";
import { fetchClients, selectClientIds } from "./clientsSlice";
import { useAppDispatch } from "../../app/hooks";
import { useEffect } from "react";
import PowerTable from "../tables/PowerTable";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import AddClientForm from "./AddClientForm";
import { useNavigate } from "react-router-dom";

const ClientsPage = () => {
  // const rows =
  const dispatch = useAppDispatch();
  const clients = useSelector(selectClientIds);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchClients());
  });

  const columns = [
    { accessorkey: "clientName", header: "Name" },
    { accessorkey: "clientNumber", header: "Number" },
    { accessorkey: "created_at", header: "Created At" },
    { accessorkey: "clerk", header: "Clerk" },
  ];

  const onDelete = (id) => {
    console.log(`"delete" ${id}`);
  };

  const onOpen = (id) => {
    console.log(`"open" ${id}`);
    navigate(`/clients/${id}`);
  };

  const onEdit = (id) => {
    console.log(`"edit" ${id}`);
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
        onOpen={onOpen}
        onEdit={onEdit}
      ></PowerTable>
    </>
  );
};

export default ClientsPage;
