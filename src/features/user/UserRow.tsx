import { useAppSelector } from "../../app/hooks";
import { selectUserById } from "./userSlice";

export default function UserRow({ id, children }) {
  const user = useAppSelector((state) => selectUserById(state, id))!;

  return (
    <tr key={id}>
      {children}
      <td>{user.username}</td>
      <td>{user.email}</td>
    </tr>
  );
}
