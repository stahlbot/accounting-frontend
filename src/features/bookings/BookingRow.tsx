import { parseISO } from "date-fns";
import { useAppSelector } from "../../app/hooks";
import { selectAccountById } from "../accounts/accountsSlice";
import { selectCategoryById } from "../categories/categoriesSlice";
import { selectBookingById } from "./bookingsSlice";

export default function AccountRow({ id, children }) {
  const booking = useAppSelector((state) => selectBookingById(state, id))!;

  const credit = useAppSelector((state) =>
    selectAccountById(state, booking.credit)
  );
  const debit = useAppSelector((state) =>
    selectAccountById(state, booking.debit)
  );

  const date = parseISO(booking.date);

  return (
    <tr key={id}>
      {children}
      <td>{booking.isCommited ? "" : "*"}</td>
      <td>{booking.value}</td>
      <td>{`${credit?.number} ${credit?.name}`}</td>
      <td>{booking.invoiceNr}</td>
      <td>{date.toLocaleDateString()}</td>
      <td>{`${debit?.number} ${debit?.name}`}</td>
      <td>{booking.text}</td>
    </tr>
  );
}
