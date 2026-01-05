import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    function handleLoginButton(e) {
        e.preventDefault();
        setIsLoading(true);

        axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {username, password})
            .then(response => {
                console.log(response.data.token);
                login(response.data.token);
                let ruolo = jwtDecode(response.data.token)?.roles;
                console.log(`In login: ${ruolo}`);

                if (ruolo === "Amministratore" || ruolo === "nuovoAmministratore") {
                    console.log("In login entro nel if nuovo amministratore");
                    navigate("/paginaAmministratore");
                } else {
                    navigate("/");
                }
            })
            .catch(error => {
                console.error("Errore durante il login:", error);
                alert("Errore nel login. Verifica username e password.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mb-4">
                        <span className="text-3xl">🔑</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Accedi</h2>
                    <p className="text-gray-600">Benvenuto su DietiEstates</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLoginButton} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-800 mb-2">
                            👤 Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Inserisci il tuo username"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                            🔒 Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Inserisci la tua password"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                            isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                        }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Accesso in corso...
                            </span>
                        ) : (
                            '🚀 Accedi'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Non hai un account?{' '}
                        <button
                            onClick={() => navigate('/registration')}
                            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                        >
                            Registrati ora
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}