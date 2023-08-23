import { useAppSelector } from "../../app/hooks";
import { selectUserById } from "./userSlice";

export default function UserRow({ id }) {
  const user = useAppSelector((state) => selectUserById(state, id))!;

  return (
    <tr key={id}>
      <td>{user.username}</td>
      <td>{user.email}</td>
    </tr>
  );
}
