import ClientRow from "./ClientRow";
import { useSelector } from "react-redux";
import { fetchClients, selectClientIds } from "./clientsSlice";
import { useAppDispatch } from "../../app/hooks";
import { useEffect } from "react";
import PowerTable from "../tables/PowerTable";

const ClientsPage = () => {
  // const rows =
  const dispatch = useAppDispatch();
  const clients = useSelector(selectClientIds);
  //   const rows = clients.map((clientId) => (
  //     <ClientRow key={clientId} id={clientId} />
  //   ));

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

  const onAdd = () => {
    console.log("add");
  };

  return (
    // <Table>
    //   <thead>
    //     <tr key="header">
    //       <th>Name</th>
    //       <th>Number</th>
    //       <th>Created at</th>
    //       <th>Clerk</th>
    //     </tr>
    //   </thead>
    //   <tbody>{rows}</tbody>
    // </Table>
    <PowerTable
      columns={columns}
      RowTemplate={ClientRow}
      data={clients}
      onDelete={onDelete}
      onAdd={onAdd}
    ></PowerTable>
  );
};

export default ClientsPage;
