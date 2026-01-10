import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google';


export function Registration() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // 🔒 Deve aver scelto il ruolo
            if (!user.ruolo) {
                alert("Seleziona prima il tipo di account");
                return;
            }

            // 🏢 Se è gestore → controlla i dati agenzia
            if (user.ruolo === 'nuovoAmministratore') {
                const errorsAgenzia = [];

                if (agenziaData.nomeAgenzia.length < 3) errorsAgenzia.push("Nome agenzia");
                if (agenziaData.indirizzoAgenzia.length < 5) errorsAgenzia.push("Indirizzo");
                if (agenziaData.cittaAgenzia.length < 2) errorsAgenzia.push("Città");
                if (!validatePhone(agenziaData.telefonoAgenzia)) errorsAgenzia.push("Telefono");
                if (!validateEmail(agenziaData.emailAgenzia)) errorsAgenzia.push("Email");
                if (!validatePartitaIVA(agenziaData.partitaIVA)) errorsAgenzia.push("Partita IVA");

                if (errorsAgenzia.length > 0) {
                    alert(
                        "Compila tutti i dati dell'agenzia prima di registrarti con Google:\n\n" +
                        errorsAgenzia.join(", ")
                    );
                    return;
                }
            }

            const googleToken = credentialResponse.credential;

            const registrationData =
                user.ruolo === 'nuovoAmministratore'
                    ? { token: googleToken, ruolo: user.ruolo, agenzia: agenziaData }
                    : { token: googleToken, ruolo: user.ruolo };

            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/google-register`,
                registrationData
            );

            alert("✅ Registrazione con Google completata!");
            navigate("/login");

        } catch (err) {
            console.error(err.response?.data);
            alert("❌ Errore durante la registrazione con Google");
        }
    };


    const handleGoogleError = () => {
        alert("Login Google annullato");
    };


    // Preleva il tipo di utente passato dalla HomePage
    const preselectedUserType = location.state?.userType || "";

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        numeroDiTelefono: "",
        ruolo: preselectedUserType
    });

    // Dati specifici per il gestore dell'agenzia
    const [agenziaData, setAgenziaData] = useState({
        nomeAgenzia: "",
        indirizzoAgenzia: "",
        cittaAgenzia: "",
        telefonoAgenzia: "",
        emailAgenzia: "",
        partitaIVA: ""
    });

    const [errors, setErrors] = useState({});

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

    const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    };

    const validatePartitaIVA = (piva) => {
        // Partita IVA italiana: 11 cifre
        const pivaRegex = /^[0-9]{11}$/;
        return pivaRegex.test(piva);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleAgenziaInputChange = (e) => {
        const { name, value } = e.target;
        setAgenziaData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = '';

        switch(name) {
            case 'username':
                if (!validateUsername(value)) {
                    error = 'Username deve contenere 3-20 caratteri (lettere, numeri, underscore)';
                }
                break;
            case 'email':
            case 'emailAgenzia':
                if (!validateEmail(value)) {
                    error = 'Inserisci un indirizzo email valido';
                }
                break;
            case 'password':
                if (!validatePassword(value)) {
                    error = 'Password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero';
                }
                break;
            case 'numeroDiTelefono':
            case 'telefonoAgenzia':
                if (!validatePhone(value)) {
                    error = 'Inserisci un numero di telefono valido (9-10 cifre)';
                }
                break;
            case 'partitaIVA':
                if (!validatePartitaIVA(value)) {
                    error = 'Partita IVA deve contenere 11 cifre';
                }
                break;
            case 'nomeAgenzia':
                if (value.length < 3) {
                    error = 'Il nome dell\'agenzia deve contenere almeno 3 caratteri';
                }
                break;
            case 'indirizzoAgenzia':
                if (value.length < 5) {
                    error = 'Inserisci un indirizzo valido';
                }
                break;
            case 'cittaAgenzia':
                if (value.length < 2) {
                    error = 'Inserisci una città valida';
                }
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Validazione campi comuni
        if (!validateUsername(user.username)) {
            newErrors.username = 'Username deve contenere 3-20 caratteri (lettere, numeri, underscore)';
        }
        if (!validateEmail(user.email)) {
            newErrors.email = 'Inserisci un indirizzo email valido';
        }
        if (!validatePassword(user.password)) {
            newErrors.password = 'Password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero';
        }
        if (!validatePhone(user.numeroDiTelefono)) {
            newErrors.numeroDiTelefono = 'Inserisci un numero di telefono valido';
        }
        if (!user.ruolo) {
            newErrors.ruolo = 'Seleziona un tipo di account';
        }

        // Validazione campi agenzia (solo per gestori)
        if (user.ruolo === 'nuovoAmministratore') {
            if (agenziaData.nomeAgenzia.length < 3) {
                newErrors.nomeAgenzia = 'Il nome dell\'agenzia deve contenere almeno 3 caratteri';
            }
            if (agenziaData.indirizzoAgenzia.length < 5) {
                newErrors.indirizzoAgenzia = 'Inserisci un indirizzo valido';
            }
            if (agenziaData.cittaAgenzia.length < 2) {
                newErrors.cittaAgenzia = 'Inserisci una città valida';
            }
            if (!validatePhone(agenziaData.telefonoAgenzia)) {
                newErrors.telefonoAgenzia = 'Inserisci un numero di telefono valido';
            }
            if (!validateEmail(agenziaData.emailAgenzia)) {
                newErrors.emailAgenzia = 'Inserisci un indirizzo email valido';
            }
            if (!validatePartitaIVA(agenziaData.partitaIVA)) {
                newErrors.partitaIVA = 'Partita IVA deve contenere 11 cifre';
            }
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        // Prepara i dati da inviare
        const registrationData = user.ruolo === 'nuovoAmministratore'
            ? { ...user, agenzia: agenziaData }
            : user;

        console.log('Dati registrazione:', registrationData);

        axios.post(`${import.meta.env.VITE_API_URL}/auth/registrazione`, registrationData)
            .then(res => {
                console.log(res.data);
                alert("✅ Registrazione completata con successo!");
                setUser({ username: "", email: "", password: "", numeroDiTelefono: "", ruolo: "" });
                setAgenziaData({
                    nomeAgenzia: "",
                    indirizzoAgenzia: "",
                    cittaAgenzia: "",
                    telefonoAgenzia: "",
                    emailAgenzia: "",
                    partitaIVA: ""
                });
                setErrors({});
                navigate("/login");
            })
            .catch(err => {
                console.error(err.response?.data);
                const errorMessage = err.response?.data?.message || err.response?.data || "Errore durante la registrazione";
                alert("❌ " + errorMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const isGestore = user.ruolo === 'nuovoAmministratore';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                        isGestore
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700'
                    }`}>
                        <span className="text-3xl">{isGestore ? '🏢' : '✨'}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {isGestore ? 'Registrazione Gestore Agenzia' : 'Registrati'}
                    </h2>
                    <p className="text-gray-600">
                        {isGestore
                            ? 'Crea il tuo account e la tua agenzia immobiliare'
                            : 'Crea il tuo account su DietiEstates'}
                    </p>
                </div>
                {/* GOOGLE REGISTRATION */}
                <div className="mb-6 flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="signup_with"
                        size="large"
                        shape="rectangular"
                    />
                </div>

                <div className="text-center text-gray-400 mb-6">
                    oppure
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sezione Dati Personali */}
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            👤 Dati Personali
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-800 mb-2">
                                    Username *
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={user.username}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Scegli un username"
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.username
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">⚠️ {errors.username}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="esempio@email.com"
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.email
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
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
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Crea una password sicura"
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.password
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">⚠️ {errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="numeroDiTelefono" className="block text-sm font-semibold text-gray-800 mb-2">
                                    Telefono *
                                </label>
                                <input
                                    id="numeroDiTelefono"
                                    name="numeroDiTelefono"
                                    type="tel"
                                    value={user.numeroDiTelefono}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="+39 123 456 7890"
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.numeroDiTelefono
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                {errors.numeroDiTelefono && (
                                    <p className="mt-1 text-sm text-red-600">⚠️ {errors.numeroDiTelefono}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tipo di account */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                            👥 Tipo di account *
                        </label>
                        <div className="grid md:grid-cols-2 gap-3">
                            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                user.ruolo === 'utente'
                                    ? 'bg-green-50 border-green-500'
                                    : 'border-gray-200 hover:bg-green-50 hover:border-green-300'
                            }`}>
                                <input
                                    type="radio"
                                    name="ruolo"
                                    value="utente"
                                    checked={user.ruolo === "utente"}
                                    onChange={handleInputChange}
                                    required
                                    className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                                />
                                <div className="ml-3">
                                    <span className="font-semibold text-gray-900">🏠 Utente</span>
                                    <p className="text-sm text-gray-600">Cerca immobili</p>
                                </div>
                            </label>

                            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                user.ruolo === 'nuovoAmministratore'
                                    ? 'bg-orange-50 border-orange-500'
                                    : 'border-gray-200 hover:bg-orange-50 hover:border-orange-300'
                            }`}>
                                <input
                                    type="radio"
                                    name="ruolo"
                                    value="nuovoAmministratore"
                                    checked={user.ruolo === "nuovoAmministratore"}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-orange-600 border-gray-300 focus:ring-orange-500"
                                />
                                <div className="ml-3">
                                    <span className="font-semibold text-gray-900">👑 Gestore Agenzia</span>
                                    <p className="text-sm text-gray-600">Gestisci agenzia</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Sezione Dati Agenzia (solo per gestori) */}
                    {isGestore && (
                        <div className="bg-orange-50 rounded-xl p-6 space-y-4 border-2 border-orange-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                🏢 Dati Agenzia Immobiliare
                            </h3>

                            <div>
                                <label htmlFor="nomeAgenzia" className="block text-sm font-semibold text-gray-800 mb-2">
                                    Nome Agenzia *
                                </label>
                                <input
                                    id="nomeAgenzia"
                                    name="nomeAgenzia"
                                    type="text"
                                    value={agenziaData.nomeAgenzia}
                                    onChange={handleAgenziaInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Es: Immobiliare DietiEstates"
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.nomeAgenzia
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-orange-500'
                                    }`}
                                />
                                {errors.nomeAgenzia && (
                                    <p className="mt-1 text-sm text-red-600">⚠️ {errors.nomeAgenzia}</p>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="indirizzoAgenzia" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Indirizzo *
                                    </label>
                                    <input
                                        id="indirizzoAgenzia"
                                        name="indirizzoAgenzia"
                                        type="text"
                                        value={agenziaData.indirizzoAgenzia}
                                        onChange={handleAgenziaInputChange}
                                        onBlur={handleBlur}
                                        placeholder="Via Roma, 123"
                                        required
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                            errors.indirizzoAgenzia
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-gray-200 focus:ring-orange-500'
                                        }`}
                                    />
                                    {errors.indirizzoAgenzia && (
                                        <p className="mt-1 text-sm text-red-600">⚠️ {errors.indirizzoAgenzia}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="cittaAgenzia" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Città *
                                    </label>
                                    <input
                                        id="cittaAgenzia"
                                        name="cittaAgenzia"
                                        type="text"
                                        value={agenziaData.cittaAgenzia}
                                        onChange={handleAgenziaInputChange}
                                        onBlur={handleBlur}
                                        placeholder="Milano"
                                        required
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                            errors.cittaAgenzia
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-gray-200 focus:ring-orange-500'
                                        }`}
                                    />
                                    {errors.cittaAgenzia && (
                                        <p className="mt-1 text-sm text-red-600">⚠️ {errors.cittaAgenzia}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="telefonoAgenzia" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Telefono Agenzia *
                                    </label>
                                    <input
                                        id="telefonoAgenzia"
                                        name="telefonoAgenzia"
                                        type="tel"
                                        value={agenziaData.telefonoAgenzia}
                                        onChange={handleAgenziaInputChange}
                                        onBlur={handleBlur}
                                        placeholder="+39 02 1234567"
                                        required
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                            errors.telefonoAgenzia
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-gray-200 focus:ring-orange-500'
                                        }`}
                                    />
                                    {errors.telefonoAgenzia && (
                                        <p className="mt-1 text-sm text-red-600">⚠️ {errors.telefonoAgenzia}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="emailAgenzia" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Email Agenzia *
                                    </label>
                                    <input
                                        id="emailAgenzia"
                                        name="emailAgenzia"
                                        type="email"
                                        value={agenziaData.emailAgenzia}
                                        onChange={handleAgenziaInputChange}
                                        onBlur={handleBlur}
                                        placeholder="info@agenzia.it"
                                        required
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                            errors.emailAgenzia
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-gray-200 focus:ring-orange-500'
                                        }`}
                                    />
                                    {errors.emailAgenzia && (
                                        <p className="mt-1 text-sm text-red-600">⚠️ {errors.emailAgenzia}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="partitaIVA" className="block text-sm font-semibold text-gray-800 mb-2">
                                    Partita IVA *
                                </label>
                                <input
                                    id="partitaIVA"
                                    name="partitaIVA"
                                    type="text"
                                    value={agenziaData.partitaIVA}
                                    onChange={handleAgenziaInputChange}
                                    onBlur={handleBlur}
                                    placeholder="12345678901"
                                    maxLength="11"
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.partitaIVA
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-orange-500'
                                    }`}
                                />
                                {errors.partitaIVA && (
                                    <p className="mt-1 text-sm text-red-600">⚠️ {errors.partitaIVA}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-600">
                                    💡 La Partita IVA italiana è composta da 11 cifre
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                            isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : isGestore
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
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
                            `🚀 Completa Registrazione ${isGestore ? 'Agenzia' : ''}`
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