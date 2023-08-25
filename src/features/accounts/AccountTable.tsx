import PowerTable from "../tables/PowerTable";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import AccountRow from "./AccountRow";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  deleteAccountChart,
  selectAccountChartById,
} from "../accountCharts/accountChartsSlice";
import { useEffect, useState } from "react";
import { clearAccountsState, deleteAccount } from "./accountsSlice";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { AccountForm } from "./AccountForm";

interface Props {
  accounts: string[];
  sortBy: string;
  setSortBy: Function;
  accountChartId: string;
}

export const AccountTable = ({
  accounts,
  sortBy,
  setSortBy,
  accountChartId,
}: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);
  const [accountEdited, setAccountEdited] = useState<string>("");

  const accountChart = useAppSelector((state) =>
    selectAccountChartById(state, accountChartId)
  );

  const columns = [
    { accessorkey: "name", header: "Name" },
    { accessorkey: "number", header: "Number" },
    { accessorkey: "nonDeductibleTax", header: "Non deductible Tax" },
  ];

  const onOpen = (id) => {
    navigate(`/settings/account-charts/${accountChart!.id}/account/${id}`);
  };

  const onEdit = (id) => {
    setAccountEdited(id);
    open();
  };

  const onDelete = async (id: string) => {
    await dispatch(
      deleteAccount({ accountId: id, accountChartId: accountChartId })
    ).unwrap();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Account Template">
        <AccountForm
          close={close}
          accountChart={accountChart!.id}
          accountId={accountEdited}
        />
      </Modal>
      <PowerTable
        columns={columns}
        RowTemplate={AccountRow}
        data={accounts}
        title={`Accounts of Account Chart ${accountChart!.name}`}
        setSortBy={setSortBy}
        sortBy={sortBy}
        onOpen={onOpen}
        onAdd={() => {
          open();
          setAccountEdited("");
        }}
        onEdit={onEdit}
        onDelete={onDelete}
      ></PowerTable>
    </>
  );
};
