import { selectClientById } from "./clientsSlice";
import { useAppSelector } from "../../app/hooks";
import { selectUserById } from "../user/userSlice";
import { parseISO } from "date-fns";

export default function ClientRow({ id, children }) {
  const client = useAppSelector((state) => selectClientById(state, id))!;

  const clerk = useAppSelector((state) => selectUserById(state, client.clerk));

  const clerkName = clerk ? `${clerk.first_name} ${clerk.last_name}` : "";

  const date = parseISO(client.createdAt);

  return (
    <tr key={id}>
      {children}
      <td>{client.name}</td>
      <td>{client.number}</td>
      <td>{date.toLocaleString()}</td>
      <td>{clerkName}</td>
    </tr>
  );
}
