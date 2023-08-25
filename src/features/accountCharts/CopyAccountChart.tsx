import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSelector } from "react-redux";
import {
  fetchAccountChartTemplates,
  selectAllAccountCharts,
} from "./accountChartsSlice";
import { RootState } from "../../app/store";
import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Button, Select, Text } from "@mantine/core";

export default function CopyAccountChart() {
  const params = useParams();
  const dispatch = useAppDispatch();

  const accountCharts = useSelector(selectAllAccountCharts);
  const accountChartsStatus = useSelector<RootState, string>(
    (state) => state.accountCharts.status
  );

  useEffect(() => {
    if (accountChartsStatus === "idle") {
      dispatch(fetchAccountChartTemplates());
    }
  }, [dispatch, accountChartsStatus]);

  const form = useForm({
    initialValues: {
      accountChartId: "",
    },
  });

  console.log(accountCharts);

  const submit = form.onSubmit(async ({ accountChartId }) => {});

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
      />
      <Button type="submit" mt={"md"} fullWidth>
        Copy
      </Button>
    </form>
  );
}
