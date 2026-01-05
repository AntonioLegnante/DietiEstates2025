import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export function Registration() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [user, setUser] = useState({
        username: "",
        password: "",
        numeroDiTelefono: "",
        ruolo: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        console.log(user);
        axios.post(`${import.meta.env.VITE_API_URL}/auth/registrazione`, user)
            .then(res => {
                console.log(res.data);
                alert("✅ Registrazione completata con successo!");
                setUser({ username: "", password: "", numeroDiTelefono: "", ruolo: "" });
                navigate("/login");
            })
            .catch(err => {
                console.error(err.response?.data);
                alert("❌ " + (err.response?.data || "Errore durante la registrazione"));
                setUser({ username: "", password: "", numeroDiTelefono: "", ruolo: "" });
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
                        <span className="text-3xl">✨</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Registrati</h2>
                    <p className="text-gray-600">Crea il tuo account su DietiEstates</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-800 mb-2">
                            👤 Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={user.username}
                            onChange={handleInputChange}
                            placeholder="Scegli un username"
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
                            name="password"
                            value={user.password}
                            onChange={handleInputChange}
                            placeholder="Crea una password sicura"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="numeroDiTelefono" className="block text-sm font-semibold text-gray-800 mb-2">
                            📱 Numero di telefono
                        </label>
                        <input
                            id="numeroDiTelefono"
                            name="numeroDiTelefono"
                            type="tel"
                            value={user.numeroDiTelefono}
                            onChange={handleInputChange}
                            placeholder="Es: +39 123 456 7890"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                            👥 Tipo di account
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                                <input
                                    type="radio"
                                    name="ruolo"
                                    value="agente immobiliare"
                                    onChange={handleInputChange}
                                    required
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <div className="ml-3">
                                    <span className="font-semibold text-gray-900">🏢 Agente immobiliare</span>
                                    <p className="text-sm text-gray-600">Gestisci e pubblica immobili</p>
                                </div>
                            </label>

                            <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all">
                                <input
                                    type="radio"
                                    name="ruolo"
                                    value="utente"
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                                />
                                <div className="ml-3">
                                    <span className="font-semibold text-gray-900">🏠 Utente</span>
                                    <p className="text-sm text-gray-600">Cerca e contatta agenti</p>
                                </div>
                            </label>

                            <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-all">
                                <input
                                    type="radio"
                                    name="ruolo"
                                    value="nuovoAmministratore"
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-orange-600 border-gray-300 focus:ring-orange-500"
                                />
                                <div className="ml-3">
                                    <span className="font-semibold text-gray-900">👑 Amministratore</span>
                                    <p className="text-sm text-gray-600">Accesso amministrativo</p>
                                </div>
                            </label>
                        </div>
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
                                Registrazione in corso...
                            </span>
                        ) : (
                            '🚀 Completa Registrazione'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Hai già un account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                        >
                            Accedi ora
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}