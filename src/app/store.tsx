import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "../features/login/currentUserSlice";
import usersReducer from "../features/user/userSlice";
import clientsReducer from "../features/clients/clientsSlice";
import accountChartsSliceReducer from "../features/accountCharts/accountChartsSlice";
import accountsSliceReducer from "../features/accounts/accountsSlice";

export const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    users: usersReducer,
    clients: clientsReducer,
    accountCharts: accountChartsSliceReducer,
    accounts: accountsSliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
