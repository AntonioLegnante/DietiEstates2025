import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { HomePage } from "./components/HomePage.jsx"
import { Login } from "./components/Login.jsx"
import { Registration } from "./components/Registration.jsx"
import { EstatesMask } from './components/EstatesMask.jsx'
import { ModalDetail } from './components/ModalDetail.jsx'
import { AuthProvider, useAuth } from './components/AuthContext.jsx';
import { Chat } from './components/Chat.jsx';
import { Chats } from './components/Chats.jsx';
import './index.css'
import { AdministratorPage } from './components/AdministratorPage.jsx'


// Sposta la navbar in un componente separato che può usare useAuth
function Navigation() {
  const { isAuthenticated, username, ruolo } = useAuth();
  console.log(`in App: ${username}`);
  console.log(`in App: ${ruolo}`);

  return (
    <nav>
      <Link to="/">Homepage</Link>
      {!isAuthenticated ? <Link to="/login">Login</Link> : <span>Benvenuto {username} </span>}
      {!isAuthenticated ? <Link to="/registration">Registration</Link> : 
      <span onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
            }}>
      Esci</span>}
      {ruolo == "Amministratore" || ruolo == "nuovoAmministratore" ? <Link to="/paginaAmministratore">Aggiungi amministratore</Link> : null}
      {isAuthenticated ? <Link to="/insert">Aggiungi immobile</Link> : null}
      {isAuthenticated ? <Link to="/Chats">Open chats</Link> : null}
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
          <Route path="/Chat" element={<Chat />}/>
          <Route path="/paginaAmministratore" element={<AdministratorPage/>} />
          <Route path="/immobile/:id" element={<ModalDetail />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/registration" element={<Registration />}/>
          <Route path="/insert" element={<EstatesMask />}/>
          <Route path="/Chats" element={<Chats />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;


