import { useAppSelector } from "../../app/hooks";
import { selectBookingsOfAccount } from "../bookings/bookingsSlice";
import { selectCategoryById } from "../categories/categoriesSlice";
import { selectAccountBalances, selectAccountById } from "./accountsSlice";

export default function ClientAccountRow({ id, children }) {
  const account = useAppSelector((state) => selectAccountById(state, id))!;

  const category = useAppSelector((state) =>
    selectCategoryById(state, account.category)
  );

  const { total, debit, credit } = useAppSelector((state) =>
    selectAccountBalances(state, id)
  );

  return (
    <tr key={id}>
      {children}
      <td>{account.name}</td>
      <td>{account.number}</td>
      <td>{category ? `${category?.document}: ${category?.name}` : "None"}</td>
      <td>{account.nonDeductibleTax ? "Yes" : "No"}</td>
      <td>{credit}</td>
      <td>{debit}</td>
      <td>{total}</td>
    </tr>
  );
}
