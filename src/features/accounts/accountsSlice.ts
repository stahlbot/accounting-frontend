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
import { useAppSelector } from "../../app/hooks";
import { Booking, selectBookingsOfAccount } from "../bookings/bookingsSlice";

interface Account {
  id: string;
  name: string;
  number: string;
  category: string;
  nonDeductibleTax: boolean;
  accountChart: string;
}

const accountsAdapter = createEntityAdapter<Account>({
  selectId: (account) => account.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

interface AdditionalState {
  status: string;
  error: string | null;
  loadedAccountCharts: string[];
}

const initialState: AdditionalState = {
  status: "idle",
  error: null,
  loadedAccountCharts: [],
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState: accountsAdapter.getInitialState(initialState),
  reducers: {
    clearAccountsState(state) {
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
        (
          state,
          action: PayloadAction<{ data: Account[]; accountChartId: string }>
        ) => {
          state.status = "succeeded";
          accountsAdapter.upsertMany(state, action.payload.data);
          state.loadedAccountCharts.push(String(action.payload.accountChartId));
        }
      )
      .addCase(fetchAccountsTemplate.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addAccountTemplate.fulfilled, accountsAdapter.addOne)
      .addCase(editAccountTemplate.fulfilled, accountsAdapter.updateOne)
      .addCase(deleteAccount.fulfilled, accountsAdapter.removeOne)
      .addCase(addManyAccounts.fulfilled, accountsAdapter.addMany);
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

export const selectClientAccountsSortedBy = createSelector(
  [
    selectAllAccounts,
    (state, props) => props.sortBy,
    (state, props) => props.accountChartId,
  ],
  (accounts, sortBy, accountChartId) => {
    const accountsFiltered = accounts.filter(
      (account) => account.accountChart == accountChartId
    );
    const accountsSorted = accountsFiltered.sort((a, b) =>
      sortStringsAndNumbers(a, b, sortBy)
    );
    return accountsSorted;
  }
);

export const selectAccountBalances = createSelector(
  [
    (state, accountId) => {
      const uff: { bookingsOfAccount: Booking[]; accountId: string } = {
        bookingsOfAccount: selectBookingsOfAccount(state, accountId),
        accountId,
      };
      return uff;
    },
    // (state, props) => props.accountIdToo,
  ],
  ({ bookingsOfAccount, accountId }) => {
    // const bookingsOfAccount = useAppSelector((state) =>
    //   selectBookingsOfAccount(state, accountId)
    // );
    {
    }

    const debitPositve = bookingsOfAccount
      .filter((booking) => booking.debit == accountId && booking.value > 0)
      .map((booking) => booking.value)
      .reduce((a, b) => a + b, 0);
    const debitNegative = bookingsOfAccount
      .filter((booking) => booking.debit == accountId && booking.value < 0)
      .map((booking) => booking.value)
      .reduce((a, b) => a + b, 0);
    const creditPositive = bookingsOfAccount
      .filter((booking) => booking.credit == accountId && booking.value > 0)
      .map((booking) => booking.value)
      .reduce((a, b) => a + b, 0);
    const creditNegative = bookingsOfAccount
      .filter((booking) => booking.credit == accountId && booking.value < 0)
      .map((booking) => booking.value)
      .reduce((a, b) => a + b, 0);
    const debit = debitPositve - creditNegative;
    const credit = creditPositive - debitNegative;
    const total = debit - credit;

    return { total, debit, credit };
  }
);

export const fetchAccountsTemplate = createAsyncThunk(
  "accounts/fetchAccountTemplates",
  async (accountChartId: string) => {
    const response = await axiosInstance.get(
      `/api/v1/account-charts/${accountChartId}/accounts`
    );
    return { data: response.data, accountChartId };
  }
);

interface AddAccount {
  name: string;
  number: string;
  category: string;
  nonDeductibleTax: boolean;
  accountChart: string;
}

export const addAccountTemplate = createAsyncThunk(
  "accounts/addAccountTemplate",
  async (account: AddAccount) => {
    const response = await axiosInstance.post(
      `/api/v1/account-charts/${account.accountChart}/accounts/`,
      account
    );
    return response.data;
  }
);

export const addManyAccounts = createAsyncThunk(
  "accounts/addManyAccounts",
  async (payload: { accounts: AddAccount[]; accountChartId: string }) => {
    const { accounts, accountChartId } = payload;
    const response = await axiosInstance.post(
      `/api/v1/account-charts/${accountChartId}/accounts/`,
      accounts
    );
    return response.data;
  }
);

export const editAccountTemplate = createAsyncThunk(
  "accounts/editAccount",
  async (account: Update<Account>) => {
    const response = await axiosInstance.patch(
      `/api/v1/account-charts/${account.changes.accountChart}/accounts/${account.id}/`,
      account.changes
    );
    return account;
  }
);

interface DeleteProps {
  accountId: string;
  accountChartId: string;
}

export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async ({ accountId, accountChartId }: DeleteProps) => {
    const response = await axiosInstance.delete(
      `/api/v1/account-charts/${accountChartId}/accounts/${accountId}/`
    );
    return accountId;
  }
);
