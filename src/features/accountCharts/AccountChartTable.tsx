import PowerTable from "../tables/PowerTable";
import AccountChartRow from "./AccountChartRow";

export const AccountChartTable = ({ accountCharts, sortBy, setSortBy }) => {
  const columns = [
    { accessorkey: "name", header: "Name" },
    { accessorkey: "isTemplate", header: "Is a Template" },
  ];

  return (
    <PowerTable
      columns={columns}
      RowTemplate={AccountChartRow}
      data={accountCharts}
      title="Account Charts"
      setSortBy={setSortBy}
      sortBy={sortBy}
    ></PowerTable>
  );
};
