import { useState } from "react";
import { useSelector } from "react-redux";
import { selectBookingIdsSortedBy } from "./bookingsSlice";
import { BookingTable } from "./BookingsTable";
import BookingForm from "./BookingForm";
import { Divider, ScrollArea, Space } from "@mantine/core";
import { useParams } from "react-router-dom";

export default function ClientBookingsPage() {
  const { clientId } = useParams();
  const [bookingEdited, setBookingEdited] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const bookings = useSelector((state) =>
    selectBookingIdsSortedBy(state, {
      sortBy: sortBy,
      clientId,
    })
  );

  return (
    <>
      <BookingForm
        bookingEditedId={bookingEdited}
        setBookingEdited={setBookingEdited}
      />
      <Space h={"md"} />
      <Divider />
      <Space h={"md"} />
      <BookingTable
        bookings={bookings}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setBookingEdited={setBookingEdited}
      />
    </>
  );
}
