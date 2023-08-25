import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import {
  selectAccountChartById,
  selectAllAccountCharts,
} from "./accountChartsSlice";

export const AccountChartPage = () => {
  const params = useParams();
  console.log(params.accountChartId);
  const accountChart = useAppSelector((state) =>
    selectAccountChartById(state, params.accountChartId!)
  );
  console.log(accountChart);

  if (accountChart) {
    return accountChart.name;
  }
};
