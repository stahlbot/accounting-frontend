import { useNavigate } from "react-router-dom";
import PowerTable from "../tables/PowerTable";
import AccountChartRow from "./AccountChartRow";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AccountChartForm } from "./AccountChartForm";

export const AccountChartTable = ({ accountCharts, sortBy, setSortBy }) => {
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);

  const columns = [
    { accessorkey: "name", header: "Name" },
    { accessorkey: "isTemplate", header: "Is a Template" },
  ];

  const onOpen = (id) => {
    navigate(`/settings/account-charts/${id}`);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Account Chart Template">
        <AccountChartForm close={close} />
      </Modal>
      <PowerTable
        columns={columns}
        RowTemplate={AccountChartRow}
        data={accountCharts}
        title="Account Charts"
        setSortBy={setSortBy}
        sortBy={sortBy}
        onOpen={onOpen}
        onAdd={() => {
          open();
        }}
      ></PowerTable>
    </>
  );
};
