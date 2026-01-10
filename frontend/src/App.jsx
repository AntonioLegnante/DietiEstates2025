import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
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
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    // Rimuovi il token
    localStorage.removeItem("token")

    // Chiudi il menu mobile se aperto
    setMenuOpen(false)

    // Naviga alla homepage PRIMA di ricaricare
    navigate('/', { replace: true })

    // Ricarica la pagina dopo un breve delay per permettere la navigazione
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">

          {/* GRID DESKTOP */}
          <div className="grid grid-cols-3 items-center gap-4">

            {/* SINISTRA */}
            <div className="flex items-center gap-2">
              {/* HAMBURGER MOBILE */}
              <button
                  className="md:hidden text-2xl p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Menu"
              >
                ☰
              </button>

              {/* NAV DESKTOP */}
              <nav className="hidden md:flex gap-2 items-center flex-wrap">
                <Link to="/" className="nav-btn">🏠 Home</Link>

                {!isAuthenticated && (
                    <>
                      <Link to="/login" className="nav-btn">🔑 Login</Link>
                      <Link to="/registration" className="nav-btn-primary">✨ Registrati</Link>
                    </>
                )}

                {isAuthenticated && (
                    <>
                      {ruolo === "agente immobiliare" && (
                          <Link to="/insert" className="nav-btn-green">
                            ➕ Aggiungi
                          </Link>
                      )}

                      <Link to="/Chats" className="nav-btn-purple">💬 Chat</Link>

                      {(ruolo === "Amministratore" || ruolo === "nuovoAmministratore") && (
                          <Link to="/paginaAmministratore" className="nav-btn-orange">
                            👤 Admin
                          </Link>
                      )}
                    </>
                )}
              </nav>
            </div>

            {/* CENTRO */}
            <div className="flex justify-center">
              <Link to="/" className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900 transition-all">
                DietiEstates🏠
              </Link>
            </div>

            {/* DESTRA */}
            <div className="hidden md:flex items-center gap-3 justify-end">
              {isAuthenticated && (
                  <>
                    <span className="text-sm text-gray-700 font-medium truncate max-w-[150px]" title={username}>
                      👋 {username}
                    </span>
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
              <div className="flex flex-col p-4 gap-2">

                <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  🏠 Homepage
                </Link>

                {!isAuthenticated && (
                    <>
                      <Link
                          to="/login"
                          onClick={() => setMenuOpen(false)}
                          className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        🔑 Login
                      </Link>
                      <Link
                          to="/registration"
                          onClick={() => setMenuOpen(false)}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center"
                      >
                        ✨ Registrati
                      </Link>
                    </>
                )}

                {isAuthenticated && (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200">
                        Ciao, {username}
                      </div>

                      {ruolo === "agente immobiliare" && (
                          <Link
                              to="/insert"
                              onClick={() => setMenuOpen(false)}
                              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            ➕ Aggiungi immobile
                          </Link>
                      )}

                      <Link
                          to="/Chats"
                          onClick={() => setMenuOpen(false)}
                          className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        💬 Chat
                      </Link>

                      {(ruolo === "Amministratore" || ruolo === "nuovoAmministratore") && (
                          <Link
                              to="/paginaAmministratore"
                              onClick={() => setMenuOpen(false)}
                              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            👤 Gestione Admin
                          </Link>
                      )}

                      <button
                          onClick={handleLogout}
                          className="text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition-colors"
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

            {/* Catch-all route per 404 */}
            <Route path="*" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-6">Pagina non trovata</p>
                  <Link
                      to="/"
                      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Torna alla Home
                  </Link>
                </div>
              </div>
            } />
          </Routes>

        </BrowserRouter>
      </AuthProvider>
  )
}

export default App