import { useSelector } from "react-redux";
import { selectUserIds, selectUserIdsSortedBy } from "./userSlice";
import PowerTable from "../tables/PowerTable";
import UserRow from "./UserRow";
import { useState } from "react";

export const UserPage = () => {
  // const users = useSelector(selectUserIds);

  const [sortBy, setSortBy] = useState<string>("name");

  const users = useSelector((state) => selectUserIdsSortedBy(state, sortBy));

  const columns = [
    { accessorkey: "userName", header: "Name" },
    { accessorkey: "email", header: "Email" },
  ];

  return (
    <PowerTable
      columns={columns}
      RowTemplate={UserRow}
      data={users}
      title="User"
      setSortBy={setSortBy}
      sortBy={sortBy}
    ></PowerTable>
  );
};
