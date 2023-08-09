import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { LoginPage } from './features/login/LoginPage'
import MainHeader from './features/header/MainHeader'
// import './App.css'



function App() {

  return (
    <MainHeader>
      <Router>
        <Routes>
          <Route path="/login" Component={LoginPage}/>
        </Routes>
        <Navigate to="/login"/>
      </Router>
    </MainHeader>
  )
}

export default App
