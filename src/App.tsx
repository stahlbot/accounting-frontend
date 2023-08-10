import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { LoginPage } from './features/login/LoginPage'
import MainHeader from './features/header/MainHeader'
import { UserPage } from './features/user/UserPage'
import { useSelector } from 'react-redux'
import { loginFromLocalStorage, selectISAuthenticated, selectUser } from './features/login/currentUserSlice'
import { useEffect, useState } from 'react'
import { useAppDispatch } from './app/hooks'
import ProtectedRoute, { ProtectedRouteProps } from './features/login/ProtectedRoute'
// import './App.css'



function App() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useSelector(selectISAuthenticated)
  // console.log(`istauth ${isAuthenticated}`)
  const [storageChecked, setStorageChecked] = useState(false)
  // let defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'>
  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const authenticationPath = 'login'

  useEffect(() => {
    dispatch(loginFromLocalStorage())
    // const iisAuthenticated = localStorage.getItem("isAuthenticated")!
    // const iisAuthenticated = useSelector(selectISAuthenticated)
    // console.log(iisAuthenticated)

    // setStorageChecked(true)
    // if (iisAuthenticated) {
    //   setIsAuthenticated(true)
    // } else {
    //   setIsAuthenticated(false)
    // }
     
  },)

  useEffect(() => {
    setStorageChecked(true)
  }, [isAuthenticated])

  

  return (
    storageChecked && <MainHeader>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/user'element={<ProtectedRoute isAuthenticated={isAuthenticated} authenticationPath='/login' outlet={<UserPage />} />} />
            {/* <Route element={<ProtectedRoute user={user} />}>
              <Route path="/user" Component={UserPage}/>
            </Route>
  <Route path="/login" Component={LoginPage}/> */}
        </Routes>
        {/* <Navigate to="/login"/> */}
      </Router>
    </MainHeader>
  )
}

export default App
