/*import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { HomePage } from "./components/HomePage.jsx"
import { Login } from "./components/Login.jsx"
import { Registration } from "./components/Registration.jsx"
import { EstatesMask } from './components/EstatesMask.jsx'
import { ModalDetail } from './components/ModalDetail.jsx'
import { AuthProvider, useAuth } from './components/AuthContext.jsx';


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AuthProvider>
      <BrowserRouter>
        <nav>
          <Link to="/">Homepage</Link>
          <Link to="/login">Login</Link>
          <Link to="/registration">Registration</Link>
          {isAuthenticated ? <Link to="/insert">new Estates</Link> : null}
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/immobile/:id" element={<ModalDetail />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/registration" element={<Registration />}/>
          <Route path="/insert" element={<EstatesMask />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}*/

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { HomePage } from "./components/HomePage.jsx"
import { Login } from "./components/Login.jsx"
import { Registration } from "./components/Registration.jsx"
import { EstatesMask } from './components/EstatesMask.jsx'
import { ModalDetail } from './components/ModalDetail.jsx'
import { AuthProvider, useAuth } from './components/AuthContext.jsx';

// Sposta la navbar in un componente separato che può usare useAuth
function Navigation() {
  const { isAuthenticated } = useAuth();
  
  return (
    <nav>
      <Link to="/">Homepage</Link>
      <Link to="/login">Login</Link>
      <Link to="/registration">Registration</Link>
      {isAuthenticated ? <Link to="/insert">new Estates</Link> : null}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/immobile/:id" element={<ModalDetail />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/registration" element={<Registration />}/>
          <Route path="/insert" element={<EstatesMask />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
