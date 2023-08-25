import CopyAccountChart from "../accountCharts/CopyAccountChart";

export default function ClientAccountsPage({ accountChartId }) {
  if (accountChartId) {
    return "AccountTable";
  } else {
    return <CopyAccountChart />;
  }
}
