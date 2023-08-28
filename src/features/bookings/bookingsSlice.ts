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

export interface Booking {
  id: string;
  debit: string;
  credit: string;
  value: number;
  date: string;
  createdAt: string;
  text: string;
  invoiceNr: string;
  client: string;
  isCommited: boolean;
}

const bookingsAdapter = createEntityAdapter<Booking>({
  selectId: (booking) => booking.id,
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

interface AdditionalState {
  status: string;
  error: string | null;
  loadedClients: string[];
}

const initialState: AdditionalState = {
  status: "idle",
  error: null,
  loadedClients: [],
};

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: bookingsAdapter.getInitialState(initialState),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchBookings.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Booking[]; clientId: string }>
        ) => {
          state.status = "succeeded";
          // console.log(state.loadedClients);
          bookingsAdapter.upsertMany(state, action.payload.data);
          state.loadedClients.push(action.payload.clientId);
          // console.log(state.loadedClients);
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
  [
    selectAllBookings,
    (state, props) => props.sortBy,
    (state, props) => props.clientId,
  ],
  (bookings, sortBy, clientId) => {
    const bookingsFiltered = bookings.filter(
      (booking: Booking) => booking.client == clientId
    );
    const bookingsSorted = bookingsFiltered.sort((a, b) =>
      sortStringsAndNumbers(a, b, sortBy)
    );
    return bookingsSorted.map((booking) => booking.id);
  }
);

export const selectBookingsOfAccount = createSelector(
  [selectAllBookings, (state, accountId) => accountId],
  (bookings, accountId) => {
    const bookingsOfAccount = bookings.filter(
      (booking: Booking) =>
        booking.credit == accountId || booking.debit == accountId
    );
    return bookingsOfAccount;
  }
);

export const selectBookingsIdsOfAccountSortedBy = createSelector(
  [
    selectAllBookings,
    (state, props) => props.accountId,
    (state, props) => props.sortBy,
  ],
  (bookings, accountId, sortBy) => {
    const bookingsOfAccount = bookings.filter(
      (booking: Booking) =>
        booking.credit == accountId || booking.debit == accountId
    );
    const bookingsSorted = bookingsOfAccount.sort((a, b) =>
      sortStringsAndNumbers(a, b, sortBy)
    );
    return bookingsOfAccount.map((booking) => booking.id);
  }
);

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (clientId: string) => {
    const response = await axiosInstance.get(
      `/api/v1/clients/${clientId}/bookings`
    );
    // const response = await axios.get("/api/v1/users", {headers: {Authorization: `Bearer ${token}`}})
    return { data: response.data, clientId };
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
