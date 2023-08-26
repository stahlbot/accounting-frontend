import { useState } from "react";
import { useSelector } from "react-redux";
import { selectBookingIdsSortedBy } from "./bookingsSlice";
import { BookingTable } from "./BookingsTable";
import BookingForm from "./BookingForm";
import { ScrollArea } from "@mantine/core";

export default function ClientBookingsPage({ clientId }) {
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
      <BookingTable
        bookings={bookings}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setBookingEdited={setBookingEdited}
      />
      <BookingForm
        bookingEditedId={bookingEdited}
        setBookingEdited={setBookingEdited}
      />
    </>
  );
}
