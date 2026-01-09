import axios from 'axios'
import { useState, useEffect } from 'react';
import { Home, Users, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function SearchFilter({ setImmobili }) {
    const [localita, setLocalita] = useState("");
    const [minPrezzo, setMinPrezzo] = useState("");
    const [maxPrezzo, setMaxPrezzo] = useState("");
    const [affitta, setAffitta] = useState(false);
    const [vendita, setVendita] = useState(false);
    const [numeroStanze, setNumeroStanze] = useState("");
    const [dimensione, setDimensione] = useState("");
    const [piano, setPiano] = useState("");
    const [classeEnergetica, setClasseEnergetica] = useState("");
    const [altriFiltriCheck, setAltriFiltri] = useState(false);

    const handleSearch = () => {
        if (!localita.trim()) {
            alert("Inserisci una località");
            return;
        }

        const params = {
            localita,
            ...(minPrezzo && { minPrezzo }),
            ...(maxPrezzo && { maxPrezzo }),
            affitta,
            vendita,
            ...(numeroStanze && { numeroStanze }),
            ...(dimensione && { dimensione }),
            ...(piano && { piano }),
            ...(classeEnergetica && { classeEnergetica })
        };

        axios.get(`${import.meta.env.VITE_API_URL}/api/immobili/ricerca`, { params })
            .then(response => {
                console.log(response.data);
                setImmobili(response.data);
            })
            .catch(error => {
                console.error("Errore nella ricerca:", error);
                alert("Si è verificato un errore durante la ricerca");
            });
    };

    const altriFiltri = (
        <div className="mt-4 space-y-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <div className="flex flex-col">
                <label htmlFor='numeroStanze' className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    🛏️ Numero di stanze:
                </label>
                <input
                    type="number"
                    id="numeroStanze"
                    value={numeroStanze}
                    onChange={e => setNumeroStanze(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor='dimensione' className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    📏 Dimensione (mq):
                </label>
                <input
                    id="dimensione"
                    type="number"
                    value={dimensione}
                    onChange={e => setDimensione(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor='piano' className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    🏢 Piano:
                </label>
                <input
                    id='piano'
                    type="number"
                    value={piano}
                    onChange={e => setPiano(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor='classeEnergetica' className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    ⚡ Classe energetica:
                </label>
                <select
                    id="classeEnergetica"
                    value={classeEnergetica}
                    onChange={e => setClasseEnergetica(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                >
                    <option value="">Seleziona...</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                </select>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-5xl mx-auto my-8 border border-gray-100">
            <div className="space-y-5">
                <div className="flex flex-col">
                    <label htmlFor="localita" className="text-sm font-semibold text-gray-800 mb-2">
                        📍 Località
                    </label>
                    <input
                        type="text"
                        id="localita"
                        value={localita}
                        onChange={e => setLocalita(e.target.value)}
                        required
                        placeholder="Es: Milano, Roma, Napoli..."
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-800 mb-2">💰 Prezzo</label>
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <label htmlFor="da" className="text-xs text-gray-600 mb-1 block">Da (€):</label>
                            <input
                                type="number"
                                id="da"
                                value={minPrezzo}
                                onChange={e => setMinPrezzo(e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <span className="text-gray-400 mt-6 font-medium">—</span>
                        <div className="flex-1">
                            <label htmlFor="a" className="text-xs text-gray-600 mb-1 block">A (€):</label>
                            <input
                                type="number"
                                id="a"
                                value={maxPrezzo}
                                onChange={e => setMaxPrezzo(e.target.value)}
                                placeholder="999999"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={affitta}
                            id="affitto"
                            onChange={e => setAffitta(e.target.checked)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="affitto" className="ml-3 text-sm font-medium text-gray-800 cursor-pointer">
                            🏠 Affitto
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={vendita}
                            id="vendita"
                            onChange={e => setVendita(e.target.checked)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="vendita" className="ml-3 text-sm font-medium text-gray-800 cursor-pointer">
                            🏡 Vendita
                        </label>
                    </div>
                </div>

                <button
                    onClick={() => setAltriFiltri(!altriFiltriCheck)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-2 transition-colors"
                >
                    <span className="text-lg">⚙️</span>
                    {altriFiltriCheck ? '- Nascondi filtri avanzati' : '+ Altri filtri'}
                </button>

                {altriFiltriCheck && altriFiltri}

                <button
                    onClick={handleSearch}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                    🔍 Cerca Immobili
                </button>
            </div>
        </div>
    );
}

function RegistrationBlocks() {
    const navigate = useNavigate();

    return (
        <div className="px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
                    Unisciti a DietiEstates
                </h2>
                <p className="text-xl text-gray-600 mb-12 text-center">
                    Scegli il tipo di account più adatto alle tue esigenze
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Blocco Utenti */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-blue-500 transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                                <Users size={40} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Sono un Utente
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Cerca la tua casa ideale tra migliaia di annunci. Contatta direttamente gli agenti immobiliari e trova l'immobile perfetto per te.
                            </p>
                            <ul className="text-left space-y-3 mb-8 w-full">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-700">Ricerca avanzata con filtri personalizzati</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-700">Contatto diretto con gli agenti</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-700">Salva i tuoi immobili preferiti</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => navigate('/registration', { state: { userType: 'utente' } })}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Registrati come Utente
                            </button>
                        </div>
                    </div>

                    {/* Blocco Gestori */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-orange-500 transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-6">
                                <Building2 size={40} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Sono un Gestore
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Gestisci la tua agenzia immobiliare, crea il tuo team di agenti e pubblica annunci per raggiungere migliaia di potenziali clienti.
                            </p>
                            <ul className="text-left space-y-3 mb-8 w-full">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-700">Crea e gestisci la tua agenzia</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-700">Aggiungi agenti al tuo team</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-700">Pubblica e gestisci annunci immobiliari</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => navigate('/registration', { state: { userType: 'nuovoAmministratore' } })}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Registrati come Gestore
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function HomePage() {
    const [userData, setUserData] = useState(null);
    const [ruolo, setRuolo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserData(decoded.sub);
                setRuolo(decoded.roles);
                console.log(`In HomePage: ${decoded.roles}`);
            } catch (error) {
                console.error("Errore nel decodificare il token:", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Benvenuto utente */}
            {userData && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 text-center shadow-md">
                    <span className="font-medium">👋 Benvenuto, {userData}</span>
                </div>
            )}

            <SearchFilter />
            <RegistrationBlocks />
        </div>
    );
}