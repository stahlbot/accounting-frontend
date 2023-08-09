import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { LoginPage } from './features/login/LoginPage'
// import './App.css'



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" Component={LoginPage}/>
      </Routes>
      <Navigate to="/login"/>
    </Router>
  )
}

export default App
