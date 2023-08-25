import { useNavigate } from "react-router-dom";
import PowerTable from "../tables/PowerTable";
import AccountChartRow from "./AccountChartRow";

export const AccountChartTable = ({ accountCharts, sortBy, setSortBy }) => {
  const navigate = useNavigate();
  const columns = [
    { accessorkey: "name", header: "Name" },
    { accessorkey: "isTemplate", header: "Is a Template" },
  ];

  const onOpen = (id) => {
    navigate(`/settings/account-charts/${id}`);
  };

  return (
    <PowerTable
      columns={columns}
      RowTemplate={AccountChartRow}
      data={accountCharts}
      title="Account Charts"
      setSortBy={setSortBy}
      sortBy={sortBy}
      onOpen={onOpen}
    ></PowerTable>
  );
};
