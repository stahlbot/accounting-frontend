import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

  return (
    storageChecked && (
      <Router>
        <MainHeader>
          <Routes>
            {/* Redirect to userpage when already logged in  */}
            <Route
              path="/login"
              element={
                <ProtectedRoute
                  isAuthenticated={!isAuthenticated}
                  authenticationPath="/user"
                  outlet={<LoginPage />}
                />
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  authenticationPath="/login"
                  outlet={<UserPage />}
                />
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  authenticationPath="/login"
                  outlet={<ClientsPage />}
                />
              }
            />
            <Route
              path="/clients/:clientId"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  authenticationPath="/login"
                  outlet={<ClientPage />}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  authenticationPath="/login"
                  outlet={<SettingsPage />}
                />
              }
            />
            <Route
              path="/settings/account-charts/:accountChartId"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  authenticationPath="/login"
                  outlet={<AccountChartPage />}
                />
              }
            />
            {/* <Route element={<ProtectedRoute user={user} />}>
              <Route path="/user" Component={UserPage}/>
            </Route>
  <Route path="/login" Component={LoginPage}/>  */}
          </Routes>
          {/* <Navigate to="/login"/> */}
        </MainHeader>
      </Router>
    )
  );
}

export default App;
