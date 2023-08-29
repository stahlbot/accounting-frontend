import { useSelector } from "react-redux";
import { fetchUsers, selectUserIds, selectUserIdsSortedBy } from "./userSlice";
import PowerTable from "../tables/PowerTable";
import UserRow from "./UserRow";
import { useEffect, useState } from "react";
import { RootState } from "../../app/store";
import { useAppDispatch } from "../../app/hooks";

export const UserPage = () => {
  // const users = useSelector(selectUserIds);
  const dispatch = useAppDispatch();

  const usersStatus = useSelector<RootState, string>(
    (state) => state.users.status
  );

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [dispatch, usersStatus]);

  const [sortBy, setSortBy] = useState<string>("name");

  const users = useSelector((state) => selectUserIdsSortedBy(state, sortBy));

  const columns = [
    { accessorkey: "username", header: "Name" },
    { accessorkey: "first_name", header: "Name" },
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
