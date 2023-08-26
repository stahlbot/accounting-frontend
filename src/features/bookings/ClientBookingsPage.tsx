import { useState } from "react";
import { useSelector } from "react-redux";
import { selectBookingIdsSortedBy } from "./bookingsSlice";
import { BookingTable } from "./BookingsTable";
import BookingForm from "./BookingForm";

export default function ClientBookingsPage({ clientId }) {
  const [sortBy, setSortBy] = useState<string>("name");
  const bookings = useSelector((state) =>
    selectBookingIdsSortedBy(state, {
      sortBy: sortBy,
      clientId,
    })
  );

  return (
    <>
      <BookingTable bookings={bookings} sortBy={sortBy} setSortBy={setSortBy} />
      <BookingForm />
    </>
  );
}
