import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { HomePage } from "./components/HomePage.jsx"
import { Login } from "./components/Login.jsx"
import { Registration } from "./components/Registration.jsx"

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Homepage</Link>
        <Link to="/login">Login</Link>
        <Link to="/registration">Registration</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/registration" element={<Registration />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
