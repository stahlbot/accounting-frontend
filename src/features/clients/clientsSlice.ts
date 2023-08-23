import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
  EntityId,
} from "@reduxjs/toolkit";

import { axiosInstance } from "../../api/api";
import { RootState } from "../../app/store";

type Client = {
  id: EntityId;
  name: string;
  number: string;
  createdAt: string;
  clerk: EntityId;
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
        (state, action: PayloadAction<ClientState[]>) => {
          const keyMap = action.payload.map(
            ({ created_at: date, ...rest }) => ({ ...rest, createdAt: date })
          );
          state.status = "succeeded";
          clientsAdapter.upsertMany(state, keyMap);
        }
      )
      .addCase(fetchClients.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default clientsSlice.reducer;

export const {
  selectAll: selectAllClients,
  selectById: selectClientById,
  selectIds: selectClientIds,
} = clientsAdapter.getSelectors((state: RootState) => state.clients);

interface ClientState {
  id: string;
  name: string;
  number: string;
  created_at: string;
  clerk: string;
}

// interface ClientsState {
//     id: string;
//     username: string;

//   }

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async () => {
    const response = await axiosInstance.get("/api/v1/clients");
    return response.data;
  }
);
