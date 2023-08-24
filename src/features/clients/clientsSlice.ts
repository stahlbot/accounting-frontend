import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
  EntityId,
  current,
} from "@reduxjs/toolkit";

import { axiosInstance } from "../../api/api";
import { RootState } from "../../app/store";

type Client = {
  id: string;
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
      .addCase(
        addClient.fulfilled,
        clientsAdapter.addOne
        // (state, action: PayloadAction<ClientState>) => {
        //   const keyMap = action.payload.map(
        //     ({ created_at: date, ...rest }) => ({ ...rest, createdAt: date })
        //   );
        //   state.status = "succeeded";
        //   clientsAdapter.upsertMany(state, keyMap);
        // }
      )
      .addCase(deleteClient.fulfilled, clientsAdapter.removeOne)
      .addCase(editClient.fulfilled, (state, action) => {
        console.log(current(state.entities));
        clientsAdapter.updateOne(state, action.payload);
        console.log(action.payload);
        console.log(current(state.entities));
      });
    //   .addCase(addClient.rejected, (state) => {
    //     state.status = "failed";
    //   });
  },
});

export default clientsSlice.reducer;

export const {
  selectAll: selectAllClients,
  selectById: selectClientById,
  selectIds: selectClientIds,
} = clientsAdapter.getSelectors((state: RootState) => state.clients);

// interface ClientState {
//   id: string;
//   name: string;
//   number: string;
//   created_at: string;
//   clerk: string;
// }

// interface ClientsState {
//     id: string;
//     username: string;

//   }

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
    // client = {
    //   ...client,
    //   // createdAt:
    // };
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
  async (client: Client) => {
    const response = await axiosInstance.patch(
      `/api/v1/clients/${client.id}/`,
      client
    );
    return response.data;
  }
);
