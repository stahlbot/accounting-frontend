import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectAccountChartById,
  selectAllAccountCharts,
} from "./accountChartsSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  clearAccountsState,
  fetchAccountsTemplate,
  selectAccountIdsSortedBy,
} from "../accounts/accountsSlice";
import { RootState } from "../../app/store";
import { AccountTable } from "../accounts/AccountTable";

export const AccountChartPage = () => {
  const dispatch = useAppDispatch();

  const params = useParams();
  const accountChart = useAppSelector((state) =>
    selectAccountChartById(state, params.accountChartId!)
  );

  const [sortBy, setSortBy] = useState<string>("name");
  const accounts = useSelector((state) =>
    selectAccountIdsSortedBy(state, {
      sortBy: sortBy,
      accountChartId: accountChart!.id,
    })
  );
  const accountsStatus = useSelector<RootState, string>(
    (state) => state.accounts.status
  );

  useEffect(() => {
    if (accountsStatus === "idle") {
      dispatch(fetchAccountsTemplate(accountChart!.id));
    }
  }, [dispatch, accountsStatus]);

  // when component unmounts reset the accounts
  useEffect(() => {
    return () => {
      dispatch(clearAccountsState());
    };
  }, [dispatch]);

  if (accountChart) {
    return (
      <AccountTable
        accounts={accounts}
        sortBy={sortBy}
        setSortBy={setSortBy}
        accountChartId={accountChart.id}
      />
    );
  }
};
