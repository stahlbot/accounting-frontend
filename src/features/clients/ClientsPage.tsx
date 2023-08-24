import ClientRow from "./ClientRow";
import { useSelector } from "react-redux";
import { deleteClient, fetchClients, selectClientIds } from "./clientsSlice";
import { useAppDispatch } from "../../app/hooks";
import { useEffect, useState } from "react";
import PowerTable from "../tables/PowerTable";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import AddClientForm from "./AddClientForm";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";

const ClientsPage = () => {
  // const rows =
  const dispatch = useAppDispatch();
  const clients = useSelector(selectClientIds);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const [clientEdited, setClientEdited] = useState<string>("");

  const clientsStatus = useSelector<RootState, string>(
    (state) => state.clients.status
  );

  useEffect(() => {
    if (clientsStatus === "idle") {
      dispatch(fetchClients());
    }
  }, [dispatch, clientsStatus]);

  const columns = [
    { accessorkey: "clientName", header: "Name" },
    { accessorkey: "clientNumber", header: "Number" },
    { accessorkey: "created_at", header: "Created At" },
    { accessorkey: "clerk", header: "Clerk" },
  ];

  const onDelete = async (id) => {
    await dispatch(deleteClient(id)).unwrap();
  };

  const onOpen = (id) => {
    navigate(`/clients/${id}`);
  };

  const onEdit = (id) => {
    setClientEdited(id);
    open();
  };

  //   useEffect(() => {
  //     if (!opened) setClientEdited("");
  //   }, [opened]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Client">
        <AddClientForm close={close} clientId={clientEdited} />
      </Modal>
      <PowerTable
        columns={columns}
        RowTemplate={ClientRow}
        data={clients}
        onDelete={onDelete}
        onAdd={() => {
          setClientEdited("");
          open();
        }}
        onOpen={onOpen}
        onEdit={onEdit}
      ></PowerTable>
    </>
  );
};

export default ClientsPage;
