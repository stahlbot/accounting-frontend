import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAccountIdsSortedBy } from "../accounts/accountsSlice";
import { AccountTable } from "../accounts/AccountTable";

export default function ClientAccountsPage({ accountChartId }) {
  const [sortBy, setSortBy] = useState<string>("name");
  const accounts = useSelector((state) =>
    selectAccountIdsSortedBy(state, {
      sortBy: sortBy,
      accountChartId,
    })
  );

  return (
    <AccountTable
      accounts={accounts}
      sortBy={sortBy}
      setSortBy={setSortBy}
      accountChartId={accountChartId}
    />
  );
}
