import { useSelector } from "react-redux";
import { selectUserIds } from "./userSlice";
import PowerTable from "../tables/PowerTable";
import UserRow from "./UserRow";

export const UserPage = () => {
  const users = useSelector(selectUserIds);

  const columns = [
    { accessorkey: "userName", header: "Name" },
    { accessorkey: "email", header: "Email" },
  ];

  return (
    <PowerTable
      columns={columns}
      RowTemplate={UserRow}
      data={users}
    ></PowerTable>
  );
};
