import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import {
  selectBookingById,
  selectBookingsIdsOfAccountSortedBy,
  selectBookingsOfAccount,
} from "../bookings/bookingsSlice";
import PowerTable from "../tables/PowerTable";
import { selectAccountBalances, selectAccountById } from "./accountsSlice";
import { parseISO } from "date-fns";
import { ReactNode, useState } from "react";
import { id } from "date-fns/locale";
import { Text } from "@mantine/core";

const BookingRow = ({ id, children }) => {
  const { accountId } = useParams();
  const booking = useAppSelector((state) => selectBookingById(state, id))!;

  const valueIsDebit = booking.debit == accountId;

  const offsettingAccountId = valueIsDebit ? booking.credit : booking.debit;

  const offsettingAccount = useAppSelector((state) =>
    selectAccountById(state, offsettingAccountId)
  );

  const date = parseISO(booking.date);

  return (
    <tr key={id}>
      {children}
      <td>{booking.isCommited ? "" : "*"}</td>
      <td>{date.toLocaleDateString()}</td>
      <td>{`${offsettingAccount?.number} ${offsettingAccount?.name}`}</td>
      <td>{booking.invoiceNr}</td>
      <td>{booking.text}</td>
      <td>{!valueIsDebit ? booking.value : ""}</td>
      <td>{valueIsDebit ? booking.value : ""}</td>
    </tr>
  );
};

const ClientAccountPage = () => {
  const { accountId } = useParams();

  const account = useAppSelector((state) =>
    selectAccountById(state, accountId!)
  )!;

  const [sortBy, setSortBy] = useState<string>("text");

  const bookings = useAppSelector((state) =>
    selectBookingsIdsOfAccountSortedBy(state, { accountId, sortBy })
  );

  const columns = [
    { accessorkey: "isCommited", header: "*" },
    // { accessorkey: "credit", header: "Credit" },
    { accessorkey: "date", header: "Date" },
    { accessorkey: "offsettingAccount", header: "Offsetting Account" },
    { accessorkey: "invoiceNr", header: "Invoice Nr." },
    { accessorkey: "text", header: "Text" },
    { accessorkey: "credit", header: "Credit" },
    { accessorkey: "debit", header: "Debit" },
  ];

  const { total, debit, credit } = useAppSelector((state) =>
    selectAccountBalances(state, accountId)
  );

  return (
    <>
      <Text fz={30} fw={700}>
        {`${account.number} ${account.name}`}
      </Text>
      <Text>Credit: {credit}</Text>
      <Text>Debit: {debit}</Text>
      <Text>Total: {total}</Text>
      <PowerTable
        columns={columns}
        RowTemplate={BookingRow}
        data={bookings}
        //   title={`${account.number} ${account.name}`}
        setSortBy={setSortBy}
        sortBy={sortBy}
        noSelect
        // onOpen={onOpen}
        //   onEdit={onEdit}
        //   onDelete={onDelete}
      />
    </>
  );
};

export default ClientAccountPage;
