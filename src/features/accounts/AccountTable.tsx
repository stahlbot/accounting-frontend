import PowerTable from "../tables/PowerTable";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import AccountRow from "./AccountRow";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccountChartById } from "../accountCharts/accountChartsSlice";
import { useEffect } from "react";
import { clearAccountsState } from "./accountsSlice";

export const AccountTable = ({
  accounts,
  sortBy,
  setSortBy,
  accountChartId,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //   const [opened, { open, close }] = useDisclosure(false);
  //   const [accountChartEdited, setAccountChartEdited] = useState<string>("");

  const accountChart = useAppSelector((state) =>
    selectAccountChartById(state, accountChartId)
  );

  const columns = [
    { accessorkey: "name", header: "Name" },
    { accessorkey: "number", header: "Number" },
  ];

  const onOpen = (id) => {
    navigate(`/settings/account-charts/${accountChart!.id}/account/${id}`);
  };

  //   const onEdit = (id) => {
  //     setAccountChartEdited(id);
  //     open();
  //   };

  //   const onDelete = async (id) => {
  //     await dispatch(deleteAccountChart(id)).unwrap();
  //   };

  return (
    <>
      {/* <Modal opened={opened} onClose={close} title="Add Account Chart Template">
        <AccountChartForm close={close} accountChartId={accountChartEdited} />
      </Modal> */}
      <PowerTable
        columns={columns}
        RowTemplate={AccountRow}
        data={accounts}
        title={`Accounts of Account Chart ${accountChart!.name}`}
        setSortBy={setSortBy}
        sortBy={sortBy}
        onOpen={onOpen}
        // onAdd={() => {
        //   open();
        //   setAccountChartEdited("");
        // }}
        // onEdit={onEdit}
        // onDelete={onDelete}
      ></PowerTable>
    </>
  );
};
