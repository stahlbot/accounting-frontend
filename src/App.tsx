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
import { selectUser } from './features/login/userSlice'
// import './App.css'



function App() {
  const user = useSelector(selectUser)

  return (
    <MainHeader>
      <Router>
        <Routes>
          {user ?
            <Route index element={<Navigate to="/user"/>}/>:
            <Route index element={<Navigate to="/login"/>}/>
          }
          <Route path="/login" Component={LoginPage}/>
          <Route path="/user" Component={UserPage}/>
        </Routes>
        {/* <Navigate to="/login"/> */}
      </Router>
    </MainHeader>
  )
}

export default App
