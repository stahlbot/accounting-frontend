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
import CopyAccountChart from "../accountCharts/CopyAccountChart";
import { fetchCategories } from "../categories/categoriesSlice";
import { fetchBookings } from "../bookings/bookingsSlice";
import ClientBookingsPage from "../bookings/ClientBookingsPage";

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

  // Fetch Accounts for this client
  const accountsStatus = useSelector<RootState, string>(
    (state) => state.accounts.status
  );
  useEffect(() => {
    if (accountsStatus === "idle" && client?.accountChart) {
      dispatch(fetchAccountsTemplate(client.accountChart));
    }
  }, [dispatch, accountsStatus, client]);
  // Reset Accounts after leaving
  useEffect(() => {
    return () => {
      dispatch(clearAccountsState());
    };
  }, [dispatch]);

  // Fetch Bookings of the client if not in already in state
  const bookingsStatus = useSelector<RootState, string>(
    (state) => state.bookings.status
  );
  const clientsBookingsLoaded: string[] = useSelector<RootState, string[]>(
    (state) => state.bookings.loadedClients
  );

  useEffect(() => {
    if (
      // bookingsStatus === "idle" &&
      client?.accountChart &&
      !clientsBookingsLoaded.includes(String(params.clientId))
    ) {
      dispatch(fetchBookings(params.clientId!));
    }
  }, [dispatch, clientsBookingsLoaded, client]);

  // Fetch Categories if not done yet
  const categoriesStatus = useSelector<RootState, string>(
    (state) => state.categories.status
  );
  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesStatus]);

  if (client) {
    return (
      <>
        {client.accountChart ? (
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
              <ClientBookingsPage clientId={params.clientId!} />
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
        ) : (
          <CopyAccountChart />
        )}
      </>
    );
  } else {
    return "Loading";
  }
};
