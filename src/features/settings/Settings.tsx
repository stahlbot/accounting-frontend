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
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Tabs
      value={useLocation()
        .pathname.split("/")
        .filter((str) => !/^\d+$/.test(str))
        .pop()}
      onTabChange={(value) => navigate(`/settings/${value}`)}
    >
      <Tabs.List>
        <Text fz={30} fw={700}>
          Settings{" "}
        </Text>
        <Tabs.Tab value="account-charts">Account Charts</Tabs.Tab>
        <Tabs.Tab value="categories">Account Categories</Tabs.Tab>
      </Tabs.List>
      <Outlet />
      {/* <Tabs.Panel value="accountcharts" pt="xs">
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
      </Tabs.Panel> */}
    </Tabs>
  );
};
