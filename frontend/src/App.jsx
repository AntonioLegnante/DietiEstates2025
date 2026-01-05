import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import { HomePage } from "./components/HomePage.jsx"
import { Login } from "./components/Login.jsx"
import { Registration } from "./components/Registration.jsx"
import { EstatesMask } from './components/EstatesMask.jsx'
import { ModalDetail } from './components/ModalDetail.jsx'
import { AuthProvider, useAuth } from './components/AuthContext.jsx'
import { Chat } from './components/Chat.jsx'
import { Chats } from './components/Chats.jsx'
import { AdministratorPage } from './components/AdministratorPage.jsx'
import './index.css'

// ======================
// NAVIGATION BAR
// ======================
function Navigation() {
  const { isAuthenticated, username, ruolo } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">

          {/* GRID DESKTOP */}
          <div className="grid grid-cols-3 items-center">

            {/* SINISTRA */}
            <div className="flex items-center gap-3">
              {/* HAMBURGER MOBILE */}
              <button
                  className="md:hidden text-2xl"
                  onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </button>

              {/* NAV DESKTOP */}
              <nav className="hidden md:flex gap-3 items-center">
                <Link to="/" className="nav-btn">🏠 Homepage</Link>

                {!isAuthenticated && (
                    <>
                      <Link to="/login" className="nav-btn">🔑 Login</Link>
                      <Link to="/registration" className="nav-btn-primary">✨ Registration</Link>
                    </>
                )}

                {isAuthenticated && (
                    <>
                      {ruolo === "agente immobiliare" && (
                          <Link to="/insert" className="nav-btn-green">
                            ➕ Aggiungi immobile
                          </Link>
                      )}

                      <Link to="/Chats" className="nav-btn-purple">💬 Chat</Link>

                      {(ruolo === "Amministratore" || ruolo === "nuovoAmministratore") && (
                          <Link to="/paginaAmministratore" className="nav-btn-orange">
                            👤 Gestione Admin
                          </Link>
                      )}
                    </>
                )}
              </nav>
            </div>

            {/* CENTRO */}
            <div className="flex justify-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                DietiEstates
              </h1>
            </div>

            {/* DESTRA */}
            <div className="hidden md:flex items-center gap-3 justify-end">
              {isAuthenticated && (
                  <>
                    <span className="text-gray-700 font-medium">👋 {username}</span>
                    <button onClick={handleLogout} className="logout-btn">
                      🚪 Esci
                    </button>
                  </>
              )}
            </div>

          </div>
        </div>

        {/* MENU MOBILE */}
        {menuOpen && (
            <div className="md:hidden bg-white border-t shadow-lg">
              <div className="flex flex-col p-4 gap-3">

                <Link to="/" onClick={() => setMenuOpen(false)}>🏠 Homepage</Link>

                {!isAuthenticated && (
                    <>
                      <Link to="/login" onClick={() => setMenuOpen(false)}>🔑 Login</Link>
                      <Link to="/registration" onClick={() => setMenuOpen(false)}>✨ Registration</Link>
                    </>
                )}

                {isAuthenticated && (
                    <>
                      {ruolo === "agente immobiliare" && (
                          <Link to="/insert" onClick={() => setMenuOpen(false)}>
                            ➕ Aggiungi immobile
                          </Link>
                      )}

                      <Link to="/Chats" onClick={() => setMenuOpen(false)}>💬 Chat</Link>

                      {(ruolo === "Amministratore" || ruolo === "nuovoAmministratore") && (
                          <Link to="/paginaAmministratore" onClick={() => setMenuOpen(false)}>
                            👤 Gestione Admin
                          </Link>
                      )}

                      <button
                          onClick={handleLogout}
                          className="text-left text-red-600 font-semibold"
                      >
                        🚪 Esci
                      </button>
                    </>
                )}
              </div>
            </div>
        )}
      </header>
  )
}

// ======================
// APP
// ======================
function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Navigation />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/insert" element={<EstatesMask />} />
            <Route path="/immobile/:id" element={<ModalDetail />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Chats" element={<Chats />} />
            <Route path="/paginaAmministratore" element={<AdministratorPage />} />
          </Routes>

        </BrowserRouter>
      </AuthProvider>
  )
}

export default App
