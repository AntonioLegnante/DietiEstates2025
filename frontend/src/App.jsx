import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { HomePage } from "./components/HomePage.jsx"
import { Login } from "./components/Login.jsx"
import { Registration } from "./components/Registration.jsx"
import { EstatesMask } from './components/EstatesMask.jsx'
import { ModalDetail } from './components/ModalDetail.jsx'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Homepage</Link>
        <Link to="/login">Login</Link>
        <Link to="/registration">Registration</Link>
        {localStorage.getItem("token") ? <Link to="/insert">new Estates</Link> : null}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/immobile/:id" element={<ModalDetail />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/registration" element={<Registration />}/>
        <Route path="/insert" element={<EstatesMask />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
