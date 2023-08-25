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

interface AccountChart {
  id: string;
  name: string;
  isTemplate: boolean | string;
}

const accountChartsAdapter = createEntityAdapter<AccountChart>({
  selectId: (accountChart) => accountChart.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const accountChartsSlice = createSlice({
  name: "accountChartTemplates",
  initialState: accountChartsAdapter.getInitialState({
    status: "idle",
    error: null,
  }),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAccountChartTemplates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAccountChartTemplates.fulfilled,
        (state, action: PayloadAction<AccountChart[]>) => {
          state.status = "succeeded";
          accountChartsAdapter.upsertMany(state, action.payload);
        }
      )
      .addCase(fetchAccountChartTemplates.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addAccountChart.fulfilled, accountChartsAdapter.addOne)
      .addCase(deleteAccountChart.fulfilled, accountChartsAdapter.removeOne)
      .addCase(editAccountChart.fulfilled, (state, action) => {
        accountChartsAdapter.updateOne(state, action.payload);
        // console.log(current(state.entities));
      });
  },
});

export default accountChartsSlice.reducer;

export const {
  selectAll: selectAllAccountCharts,
  selectById: selectAccountChartById,
  selectIds: selectAccountChartIds,
} = accountChartsAdapter.getSelectors(
  (state: RootState) => state.accountCharts
);

export const selectAccountChartIdsSortedBy = createSelector(
  [selectAllAccountCharts, (state, sortBy) => sortBy],
  (accountCharts, sortBy) => {
    const accountChartsSorted = accountCharts.sort((a, b) =>
      sortStringsAndNumbers(a, b, sortBy)
    );
    return accountChartsSorted.map((c) => c.id);
  }
);

export const fetchAccountChartTemplates = createAsyncThunk(
  "accountCharts/fetchAccountChartTemplates",
  async () => {
    const response = await axiosInstance.get(
      "/api/v1/account-charts/templates"
    );
    // const response = await axios.get("/api/v1/users", {headers: {Authorization: `Bearer ${token}`}})
    return response.data;
  }
);

export const addAccountChart = createAsyncThunk(
  "accountChart/addAccountChart",
  async (accountChart: {
    name: string;
    isTemplate: boolean | string;
    client: string;
  }) => {
    const response = await axiosInstance.post(
      "/api/v1/account-charts/",
      accountChart
    );
    return response.data;
  }
);

export const editAccountChart = createAsyncThunk(
  "accountCharts/editAccountChart",
  async (accountChart: Update<AccountChart>) => {
    const response = await axiosInstance.patch(
      `/api/v1/account-charts/${accountChart.id}/`,
      accountChart.changes
    );
    return accountChart;
  }
);

export const deleteAccountChart = createAsyncThunk(
  "accountChart/deleteAccountChart",
  async (accountChartId: string) => {
    const response = await axiosInstance.delete(
      `/api/v1/account-charts/${accountChartId}`
    );
    return accountChartId;
  }
);
