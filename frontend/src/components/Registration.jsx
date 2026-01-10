import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google';

export function Registration() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    // ⭐ NUOVO: Traccia quale metodo di registrazione sta usando
    const [registrationMethod, setRegistrationMethod] = useState(null); // null | 'google' | 'manual'

    const preselectedUserType = location.state?.userType || "";

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        numeroDiTelefono: "",
        ruolo: preselectedUserType
    });

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
        const pivaRegex = /^[0-9]{11}$/;
        return pivaRegex.test(piva);
    };

    // ⭐ GESTIONE GOOGLE LOGIN
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Controlla che abbia selezionato il ruolo
            if (!user.ruolo) {
                alert("⚠️ Seleziona prima il tipo di account (Utente o Gestore)");
                return;
            }

            // Se è gestore, valida i dati dell'agenzia
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
                        "⚠️ Compila tutti i dati dell'agenzia prima di registrarti:\n\n• " +
                        errorsAgenzia.join("\n• ")
                    );
                    return;
                }
            }

            setIsLoading(true);

            const googleToken = credentialResponse.credential;

            // Invia SOLO: token Google + ruolo + (eventualmente) dati agenzia
            const registrationData =
                user.ruolo === 'nuovoAmministratore'
                    ? { token: googleToken, ruolo: user.ruolo, agenzia: agenziaData }
                    : { token: googleToken, ruolo: user.ruolo };

            console.log('📤 Invio dati Google:', registrationData);

            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/google-register`,
                registrationData
            );

            alert("✅ Registrazione con Google completata!");
            navigate("/login");

        } catch (err) {
            console.error('❌ Errore Google:', err.response?.data);
            const errorMessage = err.response?.data?.message || "Errore durante la registrazione con Google";
            alert("❌ " + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        alert("❌ Login Google annullato");
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

        // Validazione campi comuni (SOLO per registrazione manuale)
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

    // ⭐ GESTIONE SUBMIT MANUALE
    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        // Prepara i dati da inviare (TUTTI i campi per registrazione manuale)
        const registrationData = user.ruolo === 'nuovoAmministratore'
            ? { ...user, agenzia: agenziaData }
            : user;

        console.log('📤 Invio dati manuali:', registrationData);

        axios.post(`${import.meta.env.VITE_API_URL}/auth/registrazione`, registrationData)
            .then(res => {
                console.log('✅ Registrazione riuscita:', res.data);
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
                console.error('❌ Errore registrazione:', err.response?.data);
                const errorMessage = err.response?.data?.message || err.response?.data || "Errore durante la registrazione";
                alert("❌ " + errorMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const isGestore = user.ruolo === 'nuovoAmministratore';

    // ⭐ NUOVO: Quando inizia a compilare i campi manuali, switcha a modalità manuale
    const handleManualFieldFocus = () => {
        if (registrationMethod === null) {
            setRegistrationMethod('manual');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                        isGestore
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                            : user.ruolo === 'utente'
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700'
                                : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}>
                        <span className="text-3xl">
                            {isGestore ? '🏢' : user.ruolo === 'utente' ? '✨' : '❓'}
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {isGestore
                            ? 'Registrazione Gestore Agenzia'
                            : user.ruolo === 'utente'
                                ? 'Registrati come Utente'
                                : 'Registrati su DietiEstates'}
                    </h2>
                    <p className="text-gray-600">
                        {isGestore
                            ? 'Crea il tuo account e la tua agenzia immobiliare'
                            : user.ruolo === 'utente'
                                ? 'Crea il tuo account per cercare immobili'
                                : 'Prima seleziona il tipo di account che vuoi creare'}
                    </p>
                </div>

                {/* ⭐ STEP 1: Selezione tipo di account (SEMPRE VISIBILE E OBBLIGATORIO) */}
                <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span className="text-2xl">1️⃣</span>
                            Scegli il tipo di account *
                        </label>
                        {!user.ruolo && (
                            <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold animate-pulse">
                                Obbligatorio
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Seleziona se vuoi cercare immobili o gestire un'agenzia immobiliare
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <label className={`flex flex-col items-center p-6 border-3 rounded-xl cursor-pointer transition-all ${
                            user.ruolo === 'utente'
                                ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-500 shadow-lg scale-105'
                                : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300 hover:shadow-md'
                        }`}>
                            <input
                                type="radio"
                                name="ruolo"
                                value="utente"
                                checked={user.ruolo === "utente"}
                                onChange={handleInputChange}
                                className="sr-only"
                            />
                            <div className="text-5xl mb-3">🏠</div>
                            <span className="font-bold text-xl text-gray-900 mb-2">Utente</span>
                            <p className="text-sm text-center text-gray-600 mb-3">
                                Cerca e contatta agenti immobiliari per trovare la casa dei tuoi sogni
                            </p>
                            <div className="space-y-1 text-xs text-gray-500 w-full">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Ricerca immobili</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Salva preferiti</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Chat con agenti</span>
                                </div>
                            </div>
                        </label>

                        <label className={`flex flex-col items-center p-6 border-3 rounded-xl cursor-pointer transition-all ${
                            user.ruolo === 'nuovoAmministratore'
                                ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-500 shadow-lg scale-105'
                                : 'bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-300 hover:shadow-md'
                        }`}>
                            <input
                                type="radio"
                                name="ruolo"
                                value="nuovoAmministratore"
                                checked={user.ruolo === "nuovoAmministratore"}
                                onChange={handleInputChange}
                                className="sr-only"
                            />
                            <div className="text-5xl mb-3">👑</div>
                            <span className="font-bold text-xl text-gray-900 mb-2">Gestore Agenzia</span>
                            <p className="text-sm text-center text-gray-600 mb-3">
                                Gestisci la tua agenzia immobiliare e pubblica annunci
                            </p>
                            <div className="space-y-1 text-xs text-gray-500 w-full">
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">✓</span>
                                    <span>Crea agenzia</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">✓</span>
                                    <span>Aggiungi agenti</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">✓</span>
                                    <span>Pubblica annunci</span>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* ⚠️ Messaggio di avviso se non ha selezionato il ruolo */}
                {!user.ruolo && (
                    <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <p className="font-semibold text-yellow-900 mb-1">
                                Seleziona il tipo di account per continuare
                            </p>
                            <p className="text-sm text-yellow-800">
                                Scegli se vuoi registrarti come <strong>Utente</strong> (per cercare immobili)
                                o come <strong>Gestore</strong> (per gestire un'agenzia immobiliare)
                            </p>
                        </div>
                    </div>
                )}

                {/* ⭐ STEP 2: Dati Agenzia (se Gestore) - SEMPRE VISIBILI */}
                {isGestore && (
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 space-y-4 border-2 border-orange-300 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">2️⃣</span>
                            <h3 className="text-lg font-bold text-gray-900">
                                Dati Agenzia Immobiliare
                            </h3>
                        </div>
                        <p className="text-sm text-gray-700 mb-4">
                            Inserisci i dati della tua agenzia immobiliare per completare la registrazione
                        </p>

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

                {/* ⭐ STEP 3: Google Login (sempre visibile ma disabilitato se manca il ruolo) */}
                <div className="mb-6 bg-white p-6 rounded-xl border-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{isGestore ? '3️⃣' : user.ruolo ? '2️⃣' : '⚠️'}</span>
                        <h3 className="text-lg font-bold text-gray-900">
                            Registrazione Rapida con Google
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        {user.ruolo
                            ? "Usa il tuo account Google per registrarti in un click"
                            : "Seleziona prima il tipo di account per abilitare la registrazione con Google"}
                    </p>
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            text="signup_with"
                            size="large"
                            shape="rectangular"
                            disabled={!user.ruolo || isLoading}
                        />
                    </div>
                    {!user.ruolo && (
                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
                            <span className="text-orange-600">⚠️</span>
                            <p className="text-sm text-orange-700">
                                <strong>Prima</strong> seleziona il tipo di account
                            </p>
                        </div>
                    )}
                    {isGestore && user.ruolo && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">💡</span>
                            <p className="text-sm text-blue-700">
                                Assicurati di aver compilato i <strong>dati dell'agenzia</strong> prima di cliccare su Google
                            </p>
                        </div>
                    )}
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">oppure registrati manualmente</span>
                    </div>
                </div>

                {/* ⭐ STEP 4: Form manuale */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4 border-2 border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">{isGestore ? '4️⃣' : user.ruolo ? '3️⃣' : '❓'}</span>
                            <h3 className="text-lg font-bold text-gray-900">
                                Dati Personali
                            </h3>
                        </div>
                        {!user.ruolo && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                                <span className="text-yellow-600">⚠️</span>
                                <p className="text-sm text-yellow-700">
                                    Questi campi saranno attivi dopo aver selezionato il tipo di account
                                </p>
                            </div>
                        )}

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
                                    onFocus={handleManualFieldFocus}
                                    onBlur={handleBlur}
                                    placeholder="Scegli un username"
                                    required
                                    disabled={!user.ruolo}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        !user.ruolo
                                            ? 'bg-gray-100 cursor-not-allowed'
                                            : errors.username
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
                                    onFocus={handleManualFieldFocus}
                                    onBlur={handleBlur}
                                    placeholder="esempio@email.com"
                                    required
                                    disabled={!user.ruolo}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        !user.ruolo
                                            ? 'bg-gray-100 cursor-not-allowed'
                                            : errors.email
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
                                    onFocus={handleManualFieldFocus}
                                    onBlur={handleBlur}
                                    placeholder="Crea una password sicura"
                                    required
                                    disabled={!user.ruolo}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        !user.ruolo
                                            ? 'bg-gray-100 cursor-not-allowed'
                                            : errors.password
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
                                    onFocus={handleManualFieldFocus}
                                    onBlur={handleBlur}
                                    placeholder="+39 123 456 7890"
                                    required
                                    disabled={!user.ruolo}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        !user.ruolo
                                            ? 'bg-gray-100 cursor-not-allowed'
                                            : errors.numeroDiTelefono
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

                    <button
                        type="submit"
                        disabled={isLoading || !user.ruolo}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                            isLoading || !user.ruolo
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