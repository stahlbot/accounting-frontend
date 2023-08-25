import { Tabs, Text } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectClientById } from "./clientsSlice";
import { useParams } from "react-router-dom";
import ClientAccountsPage from "./ClientAccountsPage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  clearAccountsState,
  fetchAccountsTemplate,
  selectAccountIdsSortedBy,
} from "../accounts/accountsSlice";
import { RootState } from "../../app/store";

export const ClientPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  // const id = params.clientId as EntityId | undefined;
  // console.log(id);

  // if (!id) {
  //   return <div>Loading...</div>; // Or some other suitable UI
  // }

  // const client = useSelector((state: RootState) =>
  //   selectClientById(state, params.clientId!)
  // )!;
  const client = useAppSelector((state) =>
    selectClientById(state, params.clientId!)
  );

  const [sortBy, setSortBy] = useState<string>("name");
  const accounts = useSelector((state) =>
    selectAccountIdsSortedBy(state, {
      sortBy: sortBy,
      accountChartId: client!.accountChart,
    })
  );

  const accountsStatus = useSelector<RootState, string>(
    (state) => state.accounts.status
  );

  useEffect(() => {
    if (accountsStatus === "idle" && client?.accountChart) {
      dispatch(fetchAccountsTemplate(client.accountChart));
    }
  }, [dispatch, accountsStatus, client]);

  useEffect(() => {
    return () => {
      dispatch(clearAccountsState());
    };
  }, [dispatch]);

  if (client) {
    return (
      <Tabs defaultValue="accountlist">
        <Tabs.List>
          <Text>{client.name} - </Text>
          <Text>Year Selector: </Text>
          <Tabs.Tab value="accountlist">Accounts</Tabs.Tab>
          <Tabs.Tab value="bookinglist">Bookings</Tabs.Tab>
          <Tabs.Tab value="balance">Balance</Tabs.Tab>
          <Tabs.Tab value="profitloss">Profit and Loss</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="accountlist" pt="xs">
          <ClientAccountsPage accountChartId={client.accountChart} />
        </Tabs.Panel>
        <Tabs.Panel value="bookinglist" pt="xs">
          Booking tab content
        </Tabs.Panel>
        <Tabs.Panel value="balance" pt="xs">
          Balance tab content
        </Tabs.Panel>
        <Tabs.Panel value="profitloss" pt="xs">
          Profit and Loss tab content
        </Tabs.Panel>
        <Tabs.Panel value="settings" pt="xs">
          Settings tab content
        </Tabs.Panel>
      </Tabs>
    );
  } else {
    return "Loading";
  }
};
