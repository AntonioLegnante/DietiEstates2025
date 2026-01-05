import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
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

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* GRID A 3 COLONNE */}
          <div className="grid grid-cols-3 items-center">

            {/* SINISTRA - NAV */}
            <nav className="flex gap-3 items-center justify-start">
              <Link
                  to="/"
                  className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:shadow-md"
              >
                🏠 Homepage
              </Link>

              {!isAuthenticated && (
                  <>
                    <Link
                        to="/login"
                        className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:shadow-md"
                    >
                      🔑 Login
                    </Link>

                    <Link
                        to="/registration"
                        className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      ✨ Registration
                    </Link>
                  </>
              )}

              {isAuthenticated && (
                  <>
                    {/* SOLO AGENTE IMMOBILIARE */}
                    {ruolo === "agente immobiliare" && (
                        <Link
                            to="/insert"
                            className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 hover:shadow-md"
                        >
                          ➕ Aggiungi immobile
                        </Link>
                    )}

                    <Link
                        to="/Chats"
                        className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 hover:shadow-md"
                    >
                      💬 Chat
                    </Link>

                    {(ruolo === "Amministratore" || ruolo === "nuovoAmministratore") && (
                        <Link
                            to="/paginaAmministratore"
                            className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 hover:shadow-md"
                        >
                          👤 Gestione Admin
                        </Link>
                    )}
                  </>
              )}
            </nav>

            {/* CENTRO - LOGO */}
            <div className="flex justify-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                DietiEstates
              </h1>
            </div>

            {/* DESTRA - USER */}
            <div className="flex items-center gap-3 justify-end">
              {isAuthenticated && (
                  <>
                <span className="text-gray-700 font-medium">
                  👋 {username}
                </span>

                    <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      🚪 Esci
                    </button>
                  </>
              )}
            </div>

          </div>
        </div>
      </header>
  )
}

// ======================
// APP ROUTES
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
