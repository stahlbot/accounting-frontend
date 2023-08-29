import PowerTable from "../tables/PowerTable";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import BookingRow from "./BookingRow";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteBooking } from "./bookingsSlice";
import { useDisclosure } from "@mantine/hooks";
import { Modal, ScrollArea } from "@mantine/core";

interface Props {
  bookings: string[];
  sortBy: string;
  setSortBy: Function;
  setBookingEdited: Function;
}

export const BookingTable = ({
  bookings,
  sortBy,
  setSortBy,
  setBookingEdited,
}: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //   const [opened, { open, close }] = useDisclosure(false);
  //   const [bookingEdited, setBookingEdited] = useState<string>("");

  //   const accountChart = useAppSelector((state) =>
  //     selectAccountChartById(state, accountChartId)
  //   );

  const clientId = useParams().clientId!;

  const columns = [
    { accessorkey: "isCommited", header: "*" },
    { accessorkey: "value", header: "Value" },
    { accessorkey: "credit", header: "Credit" },
    { accessorkey: "invoiceNr", header: "Invoice Nr." },
    { accessorkey: "date", header: "Date" },
    { accessorkey: "debit", header: "Debit" },
    { accessorkey: "text", header: "Text" },
  ];

  //   const onOpen = (id) => {
  //     navigate(`/settings/account-charts/${accountChartId}/account/${id}`);
  //   };

  const onEdit = (id) => {
    setBookingEdited(id);
  };

  const onDelete = async (id: string) => {
    await dispatch(deleteBooking({ bookingId: id, clientId })).unwrap();
  };

  return (
    <>
      {/* <Modal opened={opened} onClose={close} title="Add Account Template">
        <AccountForm
          close={close}
          accountChart={accountChartId}
          accountId={accountEdited}
        />
      </Modal> */}
      <ScrollArea.Autosize mah={600} mx="auto">
        <PowerTable
          columns={columns}
          RowTemplate={BookingRow}
          data={bookings}
          // title={`Bookings`}
          setSortBy={setSortBy}
          sortBy={sortBy}
          // onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </ScrollArea.Autosize>
    </>
  );
};
