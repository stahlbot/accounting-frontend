import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
  EntityId,
  current,
  Update,
  createSelector,
} from "@reduxjs/toolkit";

import { axiosInstance } from "../../api/api";
import { RootState } from "../../app/store";
import { sortStringsAndNumbers } from "../../app/sort";

type Client = {
  id: string;
  name: string;
  number: string;
  createdAt: string;
  clerk: string;
  accountChart: string;
};

const clientsAdapter = createEntityAdapter<Client>({
  selectId: (client) => client.id,
  sortComparer: (a, b) =>
    a.number.toString().localeCompare(b.number.toString()),
});

const clientsSlice = createSlice({
  name: "clients",
  initialState: clientsAdapter.getInitialState({
    status: "idle",
    error: null,
  }),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchClients.fulfilled,
        (state, action: PayloadAction<Client[]>) => {
          state.status = "succeeded";
          clientsAdapter.upsertMany(state, action.payload);
        }
      )
      .addCase(fetchClients.rejected, (state) => {
        state.status = "failed";
      })
      //   .addCase(addClient.pending, (state) => {
      //     state.status = "loading";
      //   })
      .addCase(addClient.fulfilled, clientsAdapter.addOne)
      .addCase(deleteClient.fulfilled, clientsAdapter.removeOne)
      .addCase(editClient.fulfilled, (state, action) => {
        clientsAdapter.updateOne(state, action.payload);
        // console.log(current(state.entities));
      });
  },
});

export default clientsSlice.reducer;

export const {
  selectAll: selectAllClients,
  selectById: selectClientById,
  selectIds: selectClientIds,
} = clientsAdapter.getSelectors((state: RootState) => state.clients);

export const selectClientIdsSortedBy = createSelector(
  [
    selectAllClients,
    (state, props) => props.sortBy,
    (state, props) => props.search,
  ],
  (clients, sortBy, search) => {
    const filteredClients = clients.filter((client) =>
      Object.values(client).some((value) =>
        (typeof value === "number"
          ? String(value)
          : value.toLowerCase()
        ).includes(search.toLowerCase())
      )
    );
    const clientsSorted = filteredClients.sort((a, b) =>
      sortStringsAndNumbers(a, b, sortBy)
    );
    return clientsSorted.map((c) => c.id);
  }
);

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async () => {
    const response = await axiosInstance.get("/api/v1/clients/");
    return response.data;
  }
);

export const addClient = createAsyncThunk(
  "clients/addClient",
  async (client: { name: string; number: string; clerk: string }) => {
    const response = await axiosInstance.post("/api/v1/clients/", client);
    return response.data;
  }
);

export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (clientId: string) => {
    const response = await axiosInstance.delete(`/api/v1/clients/${clientId}`);
    return clientId;
  }
);

export const editClient = createAsyncThunk(
  "clients/editClient",
  async (client: Update<Client>) => {
    const response = await axiosInstance.patch(
      `/api/v1/clients/${client.id}/`,
      client.changes
    );
    return client;
  }
);
