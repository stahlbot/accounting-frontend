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
import {
  fetchCategories,
  selectCategoryIdsSortedBy,
} from "../categories/categoriesSlice";
import { CategoryTable } from "../categories/CategoryTable";

export const SettingsPage = () => {
  const dispatch = useAppDispatch();

  const [accountChartSortBy, setAccountChartSortBy] = useState<string>("name");
  const accountCharts = useSelector((state) =>
    selectAccountChartIdsSortedBy(state, accountChartSortBy)
  );
  const accountChartsStatus = useSelector<RootState, string>(
    (state) => state.accountCharts.status
  );

  useEffect(() => {
    if (accountChartsStatus === "idle") {
      dispatch(fetchAccountChartTemplates());
    }
  }, [dispatch, accountChartsStatus]);

  const [categorySortBy, setCategorySortBy] = useState<string>("name");
  const categories = useSelector((state) =>
    selectCategoryIdsSortedBy(state, categorySortBy)
  );
  const categoriesStatus = useSelector<RootState, string>(
    (state) => state.categories.status
  );

  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesStatus]);

  return (
    <Tabs defaultValue="accountcharts">
      <Tabs.List>
        <Text fz={30} fw={700}>
          Settings{" "}
        </Text>
        <Tabs.Tab value="accountcharts">Account Charts</Tabs.Tab>
        <Tabs.Tab value="categories">Account Categories</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="accountcharts" pt="xs">
        <AccountChartTable
          accountCharts={accountCharts}
          sortBy={accountChartSortBy}
          setSortBy={setAccountChartSortBy}
        />
      </Tabs.Panel>
      <Tabs.Panel value="categories">
        <CategoryTable
          categories={categories}
          sortBy={categorySortBy}
          setSortBy={setCategorySortBy}
        />
      </Tabs.Panel>
    </Tabs>
  );
};
