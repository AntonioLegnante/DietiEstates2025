import { useState } from 'react'
import { useAuth } from './AuthContext.jsx';
import axios from 'axios';
import { UserPlus, Key, Building2, Users } from 'lucide-react';

export function AdministratorPage() {
    const { username, ruolo, setRuolo } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [administrator, setAdministrator] = useState({
        username: username,
        password: "",
        numeroDiTelefono: "",
        ruolo: ruolo
    });

    const [newAgent, setNewAgent] = useState({
        username: "",
        email: "",
        password: "",
        numeroDiTelefono: "",
        ruolo: "agente immobiliare"
    });

    const [errors, setErrors] = useState({});

    // Validazioni
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^(\+39)?[\s]?[0-9]{9,10}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const handleChangePassword = () => {
        if (!administrator.password) {
            alert("⚠️ Inserisci una password");
            return;
        }

        if (!validatePassword(administrator.password)) {
            alert("⚠️ La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero");
            return;
        }

        setIsLoading(true);
        const payload = { ...administrator, ruolo: "Amministratore" };

        axios.post(`${import.meta.env.VITE_API_URL}/auth/cambiaPassword`, payload)
            .then(res => {
                console.log("In AdministratorPage cambiaPassword");
                console.log(res.data);
                console.log("In AdministratorPage cambiaPassword dopo res.data");
                alert("✅ " + res.data);
                if(res.data.token) {
                    localStorage.setItem("token", res.data.token); // salva nuovo JWT
                }
                setRuolo("Amministratore");
                setAdministrator({ username: "", password: "", numeroDiTelefono: "N/A", ruolo: "Amministratore" });
            })
            .catch(err => {
                console.error(err.response?.data);
                alert("❌ " + (err.response?.data || "Errore durante il cambio password"));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleAddAgent = (e) => {
        e.preventDefault();

        // Validazione
        const newErrors = {};

        if (!newAgent.username || newAgent.username.length < 3) {
            newErrors.username = 'Username deve contenere almeno 3 caratteri';
        }
        if (!validateEmail(newAgent.email)) {
            newErrors.email = 'Inserisci un indirizzo email valido';
        }
        if (!validatePassword(newAgent.password)) {
            newErrors.password = 'Password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero';
        }
        if (!validatePhone(newAgent.numeroDiTelefono)) {
            newErrors.numeroDiTelefono = 'Inserisci un numero di telefono valido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        const token = localStorage.getItem("token");
        console.log("Sto per chiamare aggiungiAgente sul back-end");
        axios.post(`${import.meta.env.VITE_API_URL}/auth/aggiungiAgente`, newAgent,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                console.log(res.data);
                alert("✅ Agente immobiliare aggiunto con successo!");
                setNewAgent({
                    username: "",
                    email: "",
                    password: "",
                    numeroDiTelefono: "",
                    ruolo: "agente immobiliare"
                });
            })
            .catch(err => {
                console.error(err.response?.data);
                alert("❌ " + (err.response?.data?.message || err.response?.data || "Errore durante la registrazione dell'agente"));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleAgentInputChange = (e) => {
        const { name, value } = e.target;
        setNewAgent(prev => ({
            ...prev,
            [name]: value
        }));

        // Rimuovi errore quando l'utente inizia a correggere
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Pagina primo accesso - Cambio password obbligatorio
    const firstAccessPage = (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-orange-200">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4">
                        <Key size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Primo Accesso</h2>
                    <p className="text-gray-600">Per motivi di sicurezza, cambia la tua password</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor='nuovaPassword' className="block text-sm font-semibold text-gray-800 mb-2">
                            🔒 Nuova Password
                        </label>
                        <input
                            id='nuovaPassword'
                            type='password'
                            value={administrator.password}
                            onChange={e => setAdministrator(prev => ({
                                ...prev,
                                password: e.target.value
                            }))}
                            placeholder="Inserisci la nuova password"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                        <p className="mt-2 text-xs text-gray-600">
                            💡 La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero
                        </p>
                    </div>

                    <button
                        onClick={handleChangePassword}
                        disabled={isLoading}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                            isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                        }`}
                    >
                        {isLoading ? 'Aggiornamento...' : '✓ Conferma Nuova Password'}
                    </button>
                </div>
            </div>
        </div>
    );

    // Pagina gestione agenzia - Aggiungi agenti
    const manageAgencyPage = (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-6">
                        <Building2 size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Pannello Amministratore
                    </h1>
                    <p className="text-xl text-gray-600">
                        Gestisci la tua agenzia immobiliare
                    </p>
                </div>

                {/* Form Aggiungi Agente */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <UserPlus size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Aggiungi Nuovo Agente Immobiliare
                            </h2>
                            <p className="text-gray-600">Inserisci i dati del nuovo agente</p>
                        </div>
                    </div>

                    <form onSubmit={handleAddAgent} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor='username' className="block text-sm font-semibold text-gray-800 mb-2">
                                    👤 Username *
                                </label>
                                <input
                                    id='username'
                                    name='username'
                                    type='text'
                                    value={newAgent.username}
                                    onChange={handleAgentInputChange}
                                    placeholder="Scegli un username"
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.username
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">⚠️ {errors.username}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor='email' className="block text-sm font-semibold text-gray-800 mb-2">
                                    📧 Email *
                                </label>
                                <input
                                    id='email'
                                    name='email'
                                    type='email'
                                    value={newAgent.email}
                                    onChange={handleAgentInputChange}
                                    placeholder="esempio@email.com"
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.email
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">⚠️ {errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor='password' className="block text-sm font-semibold text-gray-800 mb-2">
                                    🔒 Password *
                                </label>
                                <input
                                    id='password'
                                    name='password'
                                    type='password'
                                    value={newAgent.password}
                                    onChange={handleAgentInputChange}
                                    placeholder="Crea una password"
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.password
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">⚠️ {errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor='numeroDiTelefono' className="block text-sm font-semibold text-gray-800 mb-2">
                                    📱 Telefono *
                                </label>
                                <input
                                    id='numeroDiTelefono'
                                    name='numeroDiTelefono'
                                    type='tel'
                                    value={newAgent.numeroDiTelefono}
                                    onChange={handleAgentInputChange}
                                    placeholder="+39 123 456 7890"
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.numeroDiTelefono
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                {errors.numeroDiTelefono && (
                                    <p className="mt-1 text-sm text-red-600">⚠️ {errors.numeroDiTelefono}</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm text-blue-800 flex items-center gap-2">
                                <Users size={18} />
                                <span>L'agente verrà automaticamente assegnato alla tua agenzia</span>
                            </p>
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
                                    Aggiunta in corso...
                                </span>
                            ) : (
                                '➕ Aggiungi Agente Immobiliare'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {ruolo === "nuovoAmministratore" ? firstAccessPage : manageAgencyPage}
        </>
    );
}