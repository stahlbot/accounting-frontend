import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from '../../app/store'
import { axiosInstance } from "../../api/api";
import { RootState } from "../../app/store";
import { sortStringsAndNumbers } from "../../app/sort";

type User = { id: string; username: string; email: string };
const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.username.localeCompare(b.username),
});

interface UsersState {
  id: string;
  username: string;
  email: string;
}

const usersSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState({
    status: "idle",
    error: null,
  }),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UsersState[]>) => {
          state.status = "succeeded";
          usersAdapter.upsertMany(state, action.payload);
        }
      )
      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default usersSlice.reducer;

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state: RootState) => state.users);

export const selectUserIdsSortedBy = createSelector(
  [selectAllUsers, (state, sortBy) => sortBy],
  (clients, sortBy) => {
    const clientsSorted = clients.sort((a, b) =>
      sortStringsAndNumbers(a, b, sortBy)
    );
    return clientsSorted.map((c) => c.id);
  }
);

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axiosInstance.get("/api/v1/users/");
  // const response = await axios.get("/api/v1/users", {headers: {Authorization: `Bearer ${token}`}})
  return response.data;
});
