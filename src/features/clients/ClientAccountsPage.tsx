import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAccountIdsSortedBy } from "../accounts/accountsSlice";
import { AccountTable } from "../accounts/AccountTable";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectClientById } from "./clientsSlice";

export default function ClientAccountsPage() {
  const { clientId } = useParams();

  const client = useAppSelector((state) => selectClientById(state, clientId!));

  const accountChartId = client!.accountChart;

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
