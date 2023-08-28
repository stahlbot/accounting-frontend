import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { LoginPage } from "./features/login/LoginPage";
import MainHeader from "./features/header/MainHeader";
import { UserPage } from "./features/user/UserPage";
import { useSelector } from "react-redux";
import {
  loginFromLocalStorage,
  selectISAuthenticated,
} from "./features/login/currentUserSlice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "./app/hooks";
import ProtectedRoute from "./features/login/ProtectedRoute";
import ClientsPage from "./features/clients/ClientsPage";
import { fetchUsers } from "./features/user/userSlice";
import { RootState } from "./app/store";
import { ClientPage } from "./features/clients/ClientPage";
import { SettingsPage } from "./features/settings/Settings";
import { AccountChartPage } from "./features/accountCharts/AccountChartPage";
import ClientAccountsPage from "./features/clients/ClientAccountsPage";
import ClientBookingsPage from "./features/bookings/ClientBookingsPage";
import { AccountChartTable } from "./features/accountCharts/AccountChartTable";
import { CategoryTable } from "./features/categories/CategoryTable";
import ClientAccountPage from "./features/accounts/ClientAccountPage";

// import './App.css'

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(selectISAuthenticated);
  // console.log(`istauth ${isAuthenticated}`)
  const [storageChecked, setStorageChecked] = useState(false);
  // let defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'>
  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const authenticationPath = 'login'

  useEffect(() => {
    dispatch(loginFromLocalStorage());
    // console.log(isAuthenticated)
  }, [dispatch]);

  useEffect(() => {
    setStorageChecked(true);
  }, [dispatch, isAuthenticated]);

  const router = createBrowserRouter([
    // createRoutesFromElements(
    //   <Route path="/" element={<MainHeader />}>
    //     <Route path="user" element={<UserPage />} />
    //   </Route>
    // )
    {
      path: "/",
      element: <MainHeader />,
      children: [
        {
          path: "login",
          element: (
            <ProtectedRoute
              isAuthenticated={!isAuthenticated}
              authenticationPath="/user"
              outlet={<LoginPage />}
            />
          ),
        },
        {
          path: "user",
          element: (
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              authenticationPath="/login"
              outlet={<UserPage />}
            />
          ),
        },
        {
          path: "clients",
          element: (
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              authenticationPath="/login"
              outlet={<ClientsPage />}
            />
          ),
        },
        {
          path: "clients/:clientId",
          element: (
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              authenticationPath="/login"
              outlet={<ClientPage />}
            />
          ),
          children: [
            {
              path: "accounts",
              element: (
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  authenticationPath="/login"
                  outlet={<ClientAccountsPage />}
                />
              ),
            },
            {
              path: "accounts/:accountId",
              element: (
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  authenticationPath="/login"
                  outlet={<ClientAccountPage />}
                />
              ),
            },
            {
              path: "bookings",
              element: (
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  authenticationPath="/login"
                  outlet={<ClientBookingsPage />}
                />
              ),
            },
          ],
        },
        {
          path: "settings",
          element: (
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              authenticationPath="/login"
              outlet={<SettingsPage />}
            />
          ),
          children: [
            {
              path: "account-charts",
              element: (
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  authenticationPath="/login"
                  outlet={<AccountChartTable />}
                />
              ),
            },
            {
              path: "account-charts/:accountChartId",
              element: (
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  authenticationPath="/login"
                  outlet={<AccountChartPage />}
                />
              ),
            },
            {
              path: "categories",
              element: (
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  authenticationPath="/login"
                  outlet={<CategoryTable />}
                />
              ),
            },
          ],
        },
      ],
    },
  ]);

  return storageChecked && <RouterProvider router={router} />;

  //   return (
  //     storageChecked && (
  //       <Router>
  //         <MainHeader>
  //           <Routes>
  //             {/* Redirect to userpage when already logged in  */}
  //             <Route
  //               path="/login"
  //               element={
  // <ProtectedRoute
  //   isAuthenticated={!isAuthenticated}
  //   authenticationPath="/user"
  //   outlet={<LoginPage />}
  // />
  //               }
  //             />
  //             <Route
  //               path="/user"
  //               element={
  // <ProtectedRoute
  //   isAuthenticated={isAuthenticated}
  //   authenticationPath="/login"
  //   outlet={<UserPage />}
  // />
  //               }
  //             />
  //             <Route
  //               path="/clients"
  //               element={
  // <ProtectedRoute
  //   isAuthenticated={isAuthenticated}
  //   authenticationPath="/login"
  //   outlet={<ClientsPage />}
  // />
  //               }
  //             />
  //             <Route
  //               path="/clients/:clientId"
  //               element={
  // <ProtectedRoute
  //   isAuthenticated={isAuthenticated}
  //   authenticationPath="/login"
  //   outlet={<ClientPage />}
  // />
  //               }
  //             />
  //             <Route
  //               path="/settings"
  //               element={
  // <ProtectedRoute
  //   isAuthenticated={isAuthenticated}
  //   authenticationPath="/login"
  //   outlet={<SettingsPage />}
  // />
  //               }
  //             />
  //             <Route
  //               path="/settings/account-charts/:accountChartId"
  //               element={
  //                 <ProtectedRoute
  //                   isAuthenticated={isAuthenticated}
  //                   authenticationPath="/login"
  //                   outlet={<AccountChartPage />}
  //                 />
  //               }
  //             />
  //             {/* <Route element={<ProtectedRoute user={user} />}>
  //               <Route path="/user" Component={UserPage}/>
  //             </Route>
  //   <Route path="/login" Component={LoginPage}/>  */}
  //           </Routes>
  //           {/* <Navigate to="/login"/> */}
  //         </MainHeader>
  //       </Router>
  //     )
  //   );
}

export default App;
