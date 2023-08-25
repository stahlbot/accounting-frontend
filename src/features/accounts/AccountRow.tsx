import { useAppSelector } from "../../app/hooks";
import { selectAccountById } from "./accountsSlice";

export default function AccountRow({ id, children }) {
  const account = useAppSelector((state) => selectAccountById(state, id))!;

  return (
    <tr key={id}>
      {children}
      <td>{account.name}</td>
      <td>{account.number}</td>
      <td>{account.nonDeductibleTax ? "Yes" : "No"}</td>
    </tr>
  );
}
