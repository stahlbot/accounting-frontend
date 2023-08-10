import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "./features/login/LoginPage";
import MainHeader from "./features/header/MainHeader";
import { UserPage } from "./features/user/UserPage";
import { useSelector } from "react-redux";
import {
  loginFromLocalStorage,
  selectISAuthenticated,
  selectUser,
} from "./features/login/currentUserSlice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "./app/hooks";
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./features/login/ProtectedRoute";
import { ClientPage } from "./features/clients/ClientPage";
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
    console.log(isAuthenticated);
    dispatch(loginFromLocalStorage());
    // console.log(isAuthenticated)
  });

  useEffect(() => {
    // console.log(isAuthenticated)
    setStorageChecked(true);
  }, [isAuthenticated]);

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
                  outlet={<ClientPage />}
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
