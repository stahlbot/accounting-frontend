import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSelector } from "react-redux";
import {
  addAccountChart,
  fetchAccountChartTemplates,
  selectAllAccountCharts,
} from "./accountChartsSlice";
import { RootState } from "../../app/store";
import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Button, Select, Text } from "@mantine/core";
import {
  addManyAccounts,
  clearAccountsState,
  fetchAccountsTemplate,
  selectAllAccounts,
} from "../accounts/accountsSlice";
import { updateAccountChart } from "../clients/clientsSlice";

export default function CopyAccountChart() {
  const params = useParams();
  const dispatch = useAppDispatch();

  const accountCharts = useSelector(selectAllAccountCharts);
  const accountChartsStatus = useSelector<RootState, string>(
    (state) => state.accountCharts.status
  );

  const accounts = useSelector(selectAllAccounts);
  //   const accountsStatus = useSelector<RootState, string>(
  //     (state) => state.accounts.status
  //   );

  const form = useForm({
    initialValues: {
      accountChartId: "",
    },
  });

  useEffect(() => {
    if (accountChartsStatus === "idle") {
      dispatch(fetchAccountChartTemplates());
    }
  }, [dispatch, accountChartsStatus]);

  useEffect(() => {
    if (form.values.accountChartId) {
      console.log("fetching accounts for this chart");
      dispatch(clearAccountsState());
      dispatch(fetchAccountsTemplate(form.values.accountChartId));
    }
  }, [form.values.accountChartId]);

  const submit = form.onSubmit(async ({ accountChartId }) => {
    const selectedAccountChart = accountCharts.find(
      (accountChart) => accountChart.id === accountChartId
    );

    dispatch(
      addAccountChart({
        name: selectedAccountChart!.name,
        isTemplate: false,
        client: params.clientId!,
      })
    )
      .unwrap()
      .then((data) => {
        const newId = data.id;
        console.log(newId);
        const newAccounts = Object.values(accounts).map((account) => {
          return { ...account, accountChart: newId };
        });
        console.log("uff");
        dispatch(clearAccountsState());
        console.log("uffter");
        dispatch(
          updateAccountChart({
            clientId: params.clientId!,
            accountChartId: newId,
          })
        );
        dispatch(
          addManyAccounts({ accounts: newAccounts, accountChartId: newId })
        );
      });
  });

  return (
    <form onSubmit={submit}>
      <Text>Select an Account Chart for this Client to get started.</Text>
      <Select
        label="Account Chart"
        placeholder="Choose an Account Chart"
        data={Object.values(accountCharts).map((accountChart) => {
          return {
            value: accountChart.id,
            label: accountChart.name,
          };
        })}
        {...form.getInputProps("accountChartId")}
        required
      />
      <Button type="submit" mt={"md"} fullWidth>
        Copy
      </Button>
    </form>
  );
}
