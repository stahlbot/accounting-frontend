import PowerTable from "../tables/PowerTable";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import AccountRow from "./AccountRow";
import { useNavigate, useParams } from "react-router-dom";
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
import ClientAccountRow from "./ClientAccountRow";

interface Props {
  accounts: string[];
  sortBy: string;
  setSortBy: Function;
  accountChartId: string;
}

export const ClientAccountTable = ({
  accounts,
  sortBy,
  setSortBy,
  accountChartId,
}: Props) => {
  const { clientId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);
  const [accountEdited, setAccountEdited] = useState<string>("");

  //   const accountChart = useAppSelector((state) =>
  //     selectAccountChartById(state, accountChartId)
  //   );

  const columns = [
    { accessorkey: "name", header: "Name" },
    { accessorkey: "number", header: "Number" },
    { accessorkey: "category", header: "Category" },
    { accessorkey: "nonDeductibleTax", header: "Non deductible Tax" },
    { accessorkey: "credit", header: "Credit" },
    { accessorkey: "debit", header: "Debit" },
    { accessorkey: "total", header: "Total" },
  ];

  const onOpen = (id) => {
    navigate(`/clients/${clientId}/accounts/${id}`);
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
          accountChart={accountChartId}
          accountId={accountEdited}
        />
      </Modal>
      <PowerTable
        columns={columns}
        RowTemplate={ClientAccountRow}
        data={accounts}
        // title={`Accounts`}
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
