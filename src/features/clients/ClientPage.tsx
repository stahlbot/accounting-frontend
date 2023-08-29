import { Tabs, Text } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectClientById } from "./clientsSlice";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
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

  const clientsAccountsLoaded: string[] = useSelector<RootState, string[]>(
    (state) => state.accounts.loadedAccountCharts
  );

  console.log(client);
  console.log(clientsAccountsLoaded);

  const accountsForClientAreLoaded: boolean = clientsAccountsLoaded.includes(
    String(client?.accountChart)
  );

  console.log(accountsForClientAreLoaded);

  useEffect(() => {
    if (!accountsForClientAreLoaded && client) {
      dispatch(fetchAccountsTemplate(client!.accountChart));
    }
  }, [dispatch, clientsAccountsLoaded, client]);
  // Reset Accounts after leaving
  // useEffect(() => {
  //   return () => {
  //     dispatch(clearAccountsState());
  //   };
  // }, [dispatch]);

  // Fetch Bookings of the client if not in already in state
  const bookingsStatus = useSelector<RootState, string>(
    (state) => state.bookings.status
  );
  const clientsBookingsLoaded: string[] = useSelector<RootState, string[]>(
    (state) => state.bookings.loadedClients
  );

  const bookingsForClientAreLoaded: boolean = clientsBookingsLoaded.includes(
    String(params.clientId)
  );

  useEffect(() => {
    if (
      // bookingsStatus === "idle" &&
      client?.accountChart &&
      !bookingsForClientAreLoaded
    ) {
      dispatch(fetchBookings(params.clientId!));
    }
  }, [dispatch, clientsBookingsLoaded, client]);

  // Fetch Categories if not done yet
  const categoriesStatus = useSelector<RootState, string>(
    (state) => state.categories.status
  );
  const categoriesAreLoaded: boolean = categoriesStatus === "succeeded";
  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesStatus]);

  if (client && client.accountChart) {
    return (
      <>
        {accountsForClientAreLoaded && bookingsForClientAreLoaded ? (
          <Tabs
            // Higlight the right Tab. works even when the url /client/1/accounts/1 is refreshed"
            value={useLocation()
              .pathname.split("/")
              .filter((str) => !/^\d+$/.test(str))
              .pop()}
            onTabChange={(value) => navigate(`/clients/${client.id}/${value}`)}
          >
            <Tabs.List>
              <Text fz={30} fw={700}>
                {client.name}
              </Text>
              {/* <Text>Year Selector: </Text> */}
              <Tabs.Tab value="accounts">Accounts</Tabs.Tab>
              <Tabs.Tab value="bookings">Bookings</Tabs.Tab>
              {/* <Tabs.Tab value="balance">Balance</Tabs.Tab>
              <Tabs.Tab value="profitloss">Profit and Loss</Tabs.Tab>
              <Tabs.Tab value="settings">Settings</Tabs.Tab> */}
            </Tabs.List>
            <Outlet />
            {/* 
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
            </Tabs.Panel> */}
          </Tabs>
        ) : (
          "Loading"
        )}
      </>
    );
  } else if (client) {
    return <CopyAccountChart />;
  } else {
    return "Loading";
  }
};
