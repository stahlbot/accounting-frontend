import { Tabs, Text } from "@mantine/core";
import { AccountChartTable } from "../accountCharts/AccountChartTable";
import { useSelector } from "react-redux";
import {
  fetchAccountChartTemplates,
  selectAccountChartIdsSortedBy,
} from "../accountCharts/accountChartsSlice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { RootState } from "../../app/store";

export const SettingsPage = () => {
  const dispatch = useAppDispatch();

  const [sortBy, setSortBy] = useState<string>("name");
  const accountCharts = useSelector((state) =>
    selectAccountChartIdsSortedBy(state, sortBy)
  );
  const accountChartsStatus = useSelector<RootState, string>(
    (state) => state.accountCharts.status
  );

  useEffect(() => {
    if (accountChartsStatus === "idle") {
      dispatch(fetchAccountChartTemplates());
    }
  }, [dispatch, accountChartsStatus]);

  return (
    <Tabs defaultValue="accountcharts">
      <Tabs.List>
        <Text fz={30} fw={700}>
          Settings{" "}
        </Text>
        <Tabs.Tab value="accountcharts">Account Charts</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="accountcharts" pt="xs">
        <AccountChartTable
          accountCharts={accountCharts}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </Tabs.Panel>
    </Tabs>
  );
};
