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

interface Account {
  id: string;
  name: string;
  number: string;
  accountChart: string;
}

const accountsAdapter = createEntityAdapter<Account>({
  selectId: (account) => account.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const accountsSlice = createSlice({
  name: "accounts",
  initialState: accountsAdapter.getInitialState({
    status: "idle",
    error: null,
  }),
  reducers: {
    clearAccountsState(state) {
      console.log("action dispatched");
      state.status = "idle";
      state.ids = [];
      state.entities = {};
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAccountsTemplate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAccountsTemplate.fulfilled,
        (state, action: PayloadAction<Account[]>) => {
          state.status = "succeeded";
          accountsAdapter.upsertMany(state, action.payload);
        }
      )
      .addCase(fetchAccountsTemplate.rejected, (state) => {
        state.status = "failed";
      });
    // .addCase(addAccount.fulfilled, accountsAdapter.addOne)
    // .addCase(deleteAccount.fulfilled, accountsAdapter.removeOne)
    // .addCase(editAccount.fulfilled, (state, action) => {
    //   accountsAdapter.updateOne(state, action.payload);
    //   // console.log(current(state.entities));
    // })
  },
});

export const { clearAccountsState } = accountsSlice.actions;

export default accountsSlice.reducer;

export const {
  selectAll: selectAllAccounts,
  selectById: selectAccountById,
  selectIds: selectAccountIds,
} = accountsAdapter.getSelectors((state: RootState) => state.accounts);

export const selectAccountIdsSortedBy = createSelector(
  [
    selectAllAccounts,
    (state, props) => props.sortBy,
    (state, props) => props.accountChartId,
  ],
  (accounts, sortBy, accountChartId) => {
    const accountsFiltered = accounts.filter(
      (account) => account.accountChart === accountChartId
    );
    const accountsSorted = accountsFiltered.sort((a, b) =>
      sortStringsAndNumbers(a, b, sortBy)
    );
    return accountsSorted.map((c) => c.id);
  }
);

export const fetchAccountsTemplate = createAsyncThunk(
  "accounts/fetchAccountTemplates",
  async (accountChartId: string) => {
    const response = await axiosInstance.get(
      `/api/v1/account-charts/${accountChartId}/accounts`
    );
    return response.data;
  }
);

// export const addAccountChart = createAsyncThunk(
//   "accountChart/addAccountChart",
//   async (accountChart: {
//     name: string;
//     isTemplate: boolean | string;
//     client: string;
//   }) => {
//     const response = await axiosInstance.post(
//       "/api/v1/account-charts/",
//       accountChart
//     );
//     return response.data;
//   }
// );

//   export const editAccountChart = createAsyncThunk(
//     "accountCharts/editAccountChart",
//     async (accountChart: Update<Account>) => {
//       const response = await axiosInstance.patch(
//         `/api/v1/account-charts/${accountChart.id}/`,
//         accountChart.changes
//       );
//       return accountChart;
//     }
//   );

//   export const deleteAccountChart = createAsyncThunk(
//     "accountChart/deleteAccountChart",
//     async (accountChartId: string) => {
//       const response = await axiosInstance.delete(
//         `/api/v1/account-charts/${accountChartId}`
//       );
//       return accountChartId;
//     }
//   );
