import { useNavigate } from "react-router-dom";
import PowerTable from "../tables/PowerTable";
import AccountChartRow from "./AccountChartRow";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AccountChartForm } from "./AccountChartForm";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteAccountChart,
  selectAccountChartIdsSortedBy,
} from "./accountChartsSlice";
import { useState } from "react";

export const AccountChartTable = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);
  const [accountChartEdited, setAccountChartEdited] = useState<string>("");

  const [accountChartSortBy, setAccountChartSortBy] = useState<string>("name");
  const accountCharts = useAppSelector((state) =>
    selectAccountChartIdsSortedBy(state, accountChartSortBy)
  );

  const columns = [
    { accessorkey: "name", header: "Name" },
    { accessorkey: "isTemplate", header: "Is a Template" },
  ];

  const onOpen = (id) => {
    navigate(`/settings/account-charts/${id}`);
  };

  const onEdit = (id) => {
    setAccountChartEdited(id);
    open();
  };

  const onDelete = async (id) => {
    await dispatch(deleteAccountChart(id)).unwrap();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Account Chart Template">
        <AccountChartForm close={close} accountChartId={accountChartEdited} />
      </Modal>
      <PowerTable
        columns={columns}
        RowTemplate={AccountChartRow}
        data={accountCharts}
        // title="Account Charts"
        setSortBy={setAccountChartSortBy}
        sortBy={accountChartSortBy}
        onOpen={onOpen}
        onAdd={() => {
          open();
          setAccountChartEdited("");
        }}
        onEdit={onEdit}
        onDelete={onDelete}
      ></PowerTable>
    </>
  );
};
