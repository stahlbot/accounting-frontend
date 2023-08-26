import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import type { PayloadAction, Update } from "@reduxjs/toolkit";
// import type { RootState } from '../../app/store'
import { axiosInstance } from "../../api/api";
import { RootState } from "../../app/store";
import { sortStringsAndNumbers } from "../../app/sort";

interface Booking {
  id: string;
  debit: string;
  credit: string;
  value: number;
  date: string;
  createdAt: string;
  text: string;
  invoiceNr: string;
  client: string;
  isCommited: string;
}

const bookingsAdapter = createEntityAdapter<Booking>({
  selectId: (booking) => booking.id,
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: bookingsAdapter.getInitialState({
    status: "idle",
    error: null,
  }),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.status = "succeeded";
          bookingsAdapter.upsertMany(state, action.payload);
        }
      )
      .addCase(fetchBookings.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addBooking.fulfilled, bookingsAdapter.addOne)
      .addCase(deleteBooking.fulfilled, bookingsAdapter.removeOne)
      .addCase(editBooking.fulfilled, (state, action) => {
        bookingsAdapter.updateOne(state, action.payload);
        // console.log(current(state.entities));
      });
  },
});

export default bookingsSlice.reducer;

export const {
  selectAll: selectAllBookings,
  selectById: selectBookingById,
  selectIds: selectBookingIds,
} = bookingsAdapter.getSelectors((state: RootState) => state.bookings);

export const selectBookingIdsSortedBy = createSelector(
  [selectAllBookings, (state, sortBy) => sortBy],
  (bookings, sortBy) => {
    const bookingsSorted = bookings.sort((a, b) =>
      sortStringsAndNumbers(a, b, sortBy)
    );
    return bookingsSorted.map((c) => c.id);
  }
);

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (clientId) => {
    const response = await axiosInstance.get(
      `/api/v1/clients/${clientId}/bookings`
    );
    // const response = await axios.get("/api/v1/users", {headers: {Authorization: `Bearer ${token}`}})
    return response.data;
  }
);

export const addBooking = createAsyncThunk(
  "bookings/addBooking",
  async (booking: Partial<Booking>) => {
    const response = await axiosInstance.post(
      `/api/v1/clients/${booking.client}/bookings/`,
      booking
    );
    return response.data;
  }
);

export const editBooking = createAsyncThunk(
  "bookings/editBooking",
  async (booking: Update<Booking>) => {
    const response = await axiosInstance.patch(
      `/api/v1/clients/${booking.changes.client}/bookings/${booking.id}/`,
      booking.changes
    );
    return booking;
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async ({ bookingId, clientId }: { bookingId: string; clientId: string }) => {
    const response = await axiosInstance.delete(
      `/api/v1/clients/${clientId}/bookings/${bookingId}/`
    );
    return bookingId;
  }
);
