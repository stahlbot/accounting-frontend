import { selectClientById } from "./clientsSlice";
import { useAppSelector } from "../../app/hooks";
import { selectUserById } from "../user/userSlice";

export default function ClientRow({ id, children }) {
  const client = useAppSelector((state) => selectClientById(state, id))!;

  const clerk = useAppSelector((state) => selectUserById(state, client.clerk));

  const clerkName = clerk ? clerk.username : "";

  return (
    <tr key={id}>
      {children}
      <td>{client.name}</td>
      <td>{client.number}</td>
      <td>{client.createdAt}</td>
      <td>{clerkName}</td>
    </tr>
  );
}
