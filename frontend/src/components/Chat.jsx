import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Home, DollarSign, CheckCircle, XCircle, TrendingUp, Clock } from 'lucide-react';

export function Chat() {
    const [chat, setChat] = useState(null);
    const [offerte, setOfferte] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
    const [showManualOfferModal, setShowManualOfferModal] = useState(false);
    const [selectedOfferta, setSelectedOfferta] = useState(null);
    const [offerAmount, setOfferAmount] = useState("");
    const [offerNote, setOfferNote] = useState("");
    const [manualOfferAmount, setManualOfferAmount] = useState("");
    const [manualOfferNote, setManualOfferNote] = useState("");
    const [manualOfferSource, setManualOfferSource] = useState("");
    const [isAgent, setIsAgent] = useState(false);
    const [senderId, setSenderId] = useState(null);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();

    const { immobile, immobileId, agenteImmobiliare, utenteLoggato, chat: initialChat, chatId: existingChatId } = location.state || {};

    const propertyId = immobileId || immobile;

    // ✅ POLLING: Aggiorna offerte ogni 3 secondi (più frequente per mobile)
    useEffect(() => {
        if (!chat?.chatId || !token) return;

        const pollInterval = setInterval(async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat/getOffers`, {
                    params: { chatId: chat.chatId },
                    headers: { Authorization: `Bearer ${token}` }
                });

                const newOfferte = response.data || [];

                // Confronta in modo più robusto
                const oldIds = offerte.map(o => o.offertaId).sort().join(',');
                const newIds = newOfferte.map(o => o.offertaId).sort().join(',');
                const oldStates = offerte.map(o => `${o.offertaId}-${o.stato}`).sort().join(',');
                const newStates = newOfferte.map(o => `${o.offertaId}-${o.stato}`).sort().join(',');

                if (oldIds !== newIds || oldStates !== newStates) {
                    console.log("🔄 Offerte aggiornate - Vecchie:", offerte.length, "Nuove:", newOfferte.length);
                    setOfferte(newOfferte);

                    // Ricarica anche i dati della chat per aggiornare lo stato
                    if (chat.statoNegoziazione !== newOfferte[newOfferte.length - 1]?.stato) {
                        const chatResponse = await axios.get(`${import.meta.env.VITE_API_URL}/chat/getChat`, {
                            params: { chatId: chat.chatId },
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setChat(chatResponse.data);
                    }
                }
            } catch (err) {
                console.error("Errore polling offerte:", err);
            }
        }, 3000); // Ogni 3 secondi (più reattivo)

        console.log("✅ Polling avviato per chat", chat.chatId);

        return () => {
            console.log("🛑 Polling fermato");
            clearInterval(pollInterval);
        };
    }, [chat?.chatId, token]); // ⚠️ Rimosso 'offerte' dalle dipendenze per evitare loop

    useEffect(() => {
        const loadChat = async () => {
            setLoading(true);
            setError(null);

            try {
                console.log("=== DEBUG CARICAMENTO CHAT ===");
                console.log("Utente loggato:", utenteLoggato);
                console.log("Agente immobiliare:", agenteImmobiliare);
                console.log("Immobile ID:", propertyId);
                console.log("Chat iniziale:", initialChat);
                console.log("Chat ID esistente:", existingChatId);

                let chatData;
                if (initialChat) {
                    console.log("Uso chat già caricata dal modal");
                    chatData = initialChat;
                } else if (existingChatId) {
                    console.log("Carico chat esistente tramite chatId:", existingChatId);
                    const chatResponse = await axios.get(`${import.meta.env.VITE_API_URL}/chat/getChat`, {
                        params: { chatId: existingChatId },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    chatData = chatResponse.data;
                } else {
                    console.log("Carico chat dal backend tramite openChat");
                    const chatResponse = await axios.get(`${import.meta.env.VITE_API_URL}/chat/openChat`, {
                        params: {
                            otherUser: agenteImmobiliare,
                            immobile: propertyId
                        },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    chatData = chatResponse.data;
                }

                console.log("Chat ricevuta:", chatData);
                setChat(chatData);

                const amIAgent = utenteLoggato === agenteImmobiliare;
                console.log("=== DETERMINAZIONE RUOLO ===");
                console.log("Sono l'agente? (utenteLoggato === agenteImmobiliare):", amIAgent);
                console.log("Confronto:", utenteLoggato, "===", agenteImmobiliare);

                let myUserId;
                if (amIAgent) {
                    myUserId = chatData.vendorId;
                    console.log("Sono l'agente, uso vendorId:", myUserId);
                } else {
                    myUserId = chatData.utenteId;
                    console.log("Sono l'utente, uso utenteId:", myUserId);
                }

                console.log("Il mio user ID finale:", myUserId);
                console.log("VendorId dal backend:", chatData.vendorId, "UtenteId dal backend:", chatData.utenteId);
                setSenderId(myUserId);
                setIsAgent(amIAgent);

                if (chatData.chatId) {
                    const offerteResponse = await axios.get(`${import.meta.env.VITE_API_URL}/chat/getOffers`, {
                        params: { chatId: chatData.chatId },
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    console.log("Offerte ricevute:", offerteResponse.data);
                    setOfferte(offerteResponse.data || []);
                } else {
                    console.warn("ChatId non disponibile");
                    setOfferte([]);
                }

            } catch (err) {
                console.error("Errore caricamento chat:", err);
                console.error("Dettagli errore:", err.response?.data);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (utenteLoggato && agenteImmobiliare && propertyId) {
            loadChat();
        } else {
            console.error("Parametri mancanti:", {
                utenteLoggato,
                agenteImmobiliare,
                propertyId,
                immobile,
                immobileId
            });
            setError(new Error("Parametri mancanti per aprire la chat"));
            setLoading(false);
        }
    }, [propertyId, agenteImmobiliare, utenteLoggato, token, initialChat, existingChatId]);

    const handleMakeOffer = async (e) => {
        e.preventDefault();

        console.log("=== DEBUG INVIO OFFERTA ===");
        console.log("Chat ID:", chat?.chatId);
        console.log("Importo:", offerAmount);
        console.log("Note:", offerNote);

        if (!chat?.chatId) {
            alert("Errore: Chat non trovata");
            console.error("Chat non disponibile:", chat);
            return;
        }

        if (!offerAmount || parseFloat(offerAmount) <= 0) {
            alert("Inserisci un importo valido");
            return;
        }

        try {
            console.log("Invio richiesta POST a:", `${import.meta.env.VITE_API_URL}/chat/makeOffer`);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/chat/makeOffer`,
                null,
                {
                    params: {
                        chatId: chat.chatId,
                        importo: parseFloat(offerAmount),
                        note: offerNote || null
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log("Offerta inviata con successo:", response.data);

            setOfferte([...offerte, response.data]);
            setShowOfferModal(false);
            setOfferAmount("");
            setOfferNote("");

            alert("Offerta inviata con successo!");
        } catch (err) {
            console.error("Errore invio offerta:", err);
            console.error("Risposta errore:", err.response?.data);
            alert(`Errore nell'invio dell'offerta: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleAcceptOffer = async (offertaId) => {
        if (!window.confirm("Sei sicuro di voler accettare questa offerta?")) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/chat/acceptOffer`,
                null,
                {
                    params: { offertaId: offertaId },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setOfferte(offerte.map(o =>
                o.offertaId === offertaId ? { ...o, stato: "ACCETTATA" } : o
            ));
            setChat({ ...chat, statoNegoziazione: "CHIUSA_ACCETTATA" });

            alert("Offerta accettata con successo!");
        } catch (err) {
            console.error("Errore accettazione offerta:", err);
            alert("Errore nell'accettazione dell'offerta");
        }
    };

    const handleRejectOffer = async (offertaId) => {
        const motivo = window.prompt("Motivo del rifiuto (opzionale):");

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/chat/rejectOffer`,
                null,
                {
                    params: {
                        offertaId: offertaId,
                        motivo: motivo || null
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setOfferte(offerte.map(o =>
                o.offertaId === offertaId
                    ? { ...o, stato: "RIFIUTATA", motivoRifiuto: motivo }
                    : o
            ));

            alert("Offerta rifiutata");
        } catch (err) {
            console.error("Errore rifiuto offerta:", err);
            alert("Errore nel rifiuto dell'offerta");
        }
    };

    const handleCounterOffer = async (e) => {
        e.preventDefault();

        if (!offerAmount || parseFloat(offerAmount) <= 0) {
            alert("Inserisci un importo valido");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/chat/counterOffer`,
                null,
                {
                    params: {
                        offertaId: selectedOfferta.offertaId,
                        nuovoImporto: parseFloat(offerAmount),
                        note: offerNote || null
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setOfferte(offerte.map(o =>
                o.offertaId === selectedOfferta.offertaId
                    ? { ...o, stato: "CONTROFFERTA" }
                    : o
            ).concat(response.data));

            setShowCounterOfferModal(false);
            setSelectedOfferta(null);
            setOfferAmount("");
            setOfferNote("");

            alert("Controfferta inviata!");
        } catch (err) {
            console.error("Errore invio controfferta:", err);
            alert("Errore nell'invio della controfferta");
        }
    };

    // ✅ NUOVO: Registra offerta manuale (solo agenti)
    const handleManualOffer = async (e) => {
        e.preventDefault();

        if (!manualOfferAmount || parseFloat(manualOfferAmount) <= 0) {
            alert("Inserisci un importo valido");
            return;
        }

        if (!manualOfferSource || manualOfferSource.trim() === "") {
            alert("Inserisci la fonte dell'offerta (es: telefono, email, visita)");
            return;
        }

        try {
            const noteCompleta = `[OFFERTA ESTERNA - ${manualOfferSource}] ${manualOfferNote || 'Nessuna nota aggiuntiva'}`;

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/chat/manualOffer`,
                null,
                {
                    params: {
                        chatId: chat.chatId,
                        importo: parseFloat(manualOfferAmount),
                        note: noteCompleta
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setOfferte([...offerte, response.data]);
            setShowManualOfferModal(false);
            setManualOfferAmount("");
            setManualOfferNote("");
            setManualOfferSource("");

            alert("Offerta esterna registrata con successo!");
        } catch (err) {
            console.error("Errore registrazione offerta manuale:", err);
            alert(`Errore: ${err.response?.data?.message || err.message}`);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatoBadge = (stato) => {
        const badges = {
            IN_ATTESA: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'In Attesa' },
            ACCETTATA: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Accettata' },
            RIFIUTATA: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rifiutata' },
            CONTROFFERTA: { color: 'bg-blue-100 text-blue-800', icon: TrendingUp, text: 'Controfferta' }
        };

        const badge = badges[stato] || badges.IN_ATTESA;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                <Icon size={14} />
                {badge.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Caricamento negoziazione...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Errore</h2>
                    <p className="text-gray-600 mb-4">Impossibile caricare la negoziazione.</p>
                    <p className="text-sm text-gray-500 mb-6">{error.message}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                    >
                        Torna indietro
                    </button>
                </div>
            </div>
        );
    }

    const isClosed = chat?.statoNegoziazione?.includes('CHIUSA');
    const otherUserName = isAgent ? chat?.utenteNome : chat?.vendorNome;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-md">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        >
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg">
                                    {otherUserName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="font-bold text-gray-900 truncate">{otherUserName}</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Home size={14} className="flex-shrink-0" />
                                    <span className="truncate">{chat?.immobileTitolo || `Immobile #${propertyId}`}</span>
                                </div>
                            </div>
                            {isClosed && (
                                <div className="flex-shrink-0">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                        Negoziazione Chiusa
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Area Offerte */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {offerte && offerte.length > 0 ? (
                        offerte.map((offerta, idx) => {
                            const isMyOffer = offerta.offerenteId === senderId;
                            const canRespond = !isMyOffer && offerta.stato === 'IN_ATTESA' && !isClosed;

                            return (
                                <div
                                    key={idx}
                                    className={`bg-white rounded-2xl shadow-md p-6 border-2 ${
                                        offerta.stato === 'ACCETTATA' ? 'border-green-300' :
                                            offerta.stato === 'RIFIUTATA' ? 'border-red-300' :
                                                offerta.stato === 'CONTROFFERTA' ? 'border-blue-300' :
                                                    'border-gray-200'
                                    }`}
                                >
                                    {/* Header Offerta */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                                                <DollarSign size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    {isMyOffer ? 'La tua offerta' : `Offerta da ${offerta.offerenteNome}`}
                                                </p>
                                                <p className="text-xs text-gray-500">{formatDate(offerta.dataCreazione)}</p>
                                            </div>
                                        </div>
                                        {getStatoBadge(offerta.stato)}
                                    </div>

                                    {/* Importo */}
                                    <div className="mb-4">
                                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(offerta.importoOfferto)}</p>
                                    </div>

                                    {/* Note */}
                                    {offerta.note && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-700">{offerta.note}</p>
                                        </div>
                                    )}

                                    {/* Motivo Rifiuto */}
                                    {offerta.stato === 'RIFIUTATA' && offerta.motivoRifiuto && (
                                        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                            <p className="text-sm text-red-800">
                                                <strong>Motivo rifiuto:</strong> {offerta.motivoRifiuto}
                                            </p>
                                        </div>
                                    )}

                                    {/* Azioni - Responsive: colonna su mobile, riga su desktop */}
                                    {canRespond && (
                                        <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                                            <div className="text-xs text-blue-600 mb-1">
                                                💡 Puoi rispondere a questa {isAgent ? 'offerta' : 'controfferta'}
                                            </div>
                                            {/* Layout responsive: tutto a colonna su mobile per evitare overflow */}
                                            <div className="flex flex-col gap-2 w-full">
                                                <button
                                                    onClick={() => handleAcceptOffer(offerta.offertaId)}
                                                    className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={18} className="flex-shrink-0" />
                                                    <span>Accetta</span>
                                                </button>
                                                {isAgent && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOfferta(offerta);
                                                            setShowCounterOfferModal(true);
                                                        }}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <TrendingUp size={18} className="flex-shrink-0" />
                                                        <span>Controfferta</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRejectOffer(offerta.offertaId)}
                                                    className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <XCircle size={18} className="flex-shrink-0" />
                                                    <span>Rifiuta</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                            <div className="text-6xl mb-4">💰</div>
                            <p className="text-gray-500 text-lg">Nessuna offerta ancora</p>
                            <p className="text-gray-400 text-sm mt-2">Inizia la negoziazione!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottone Nuova Offerta */}
            {!isAgent && !isClosed && (
                <div className="bg-white border-t border-gray-200 sticky bottom-0">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <button
                            onClick={() => setShowOfferModal(true)}
                            disabled={!chat || !chat.chatId}
                            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <DollarSign size={20} />
                            Fai un'offerta
                        </button>
                    </div>
                </div>
            )}

            {/* Bottone Registra Offerta Esterna (solo agenti, sempre visibile) */}
            {isAgent && (
                <div className="bg-white border-t border-gray-200 sticky bottom-0">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <button
                            onClick={() => setShowManualOfferModal(true)}
                            disabled={!chat || !chat.chatId}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <DollarSign size={20} />
                            📝 Registra offerta esterna
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Nuova Offerta */}
            {showOfferModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowOfferModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Fai un'offerta</h3>
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Importo offerto (€)
                                </label>
                                <input
                                    type="number"
                                    value={offerAmount}
                                    onChange={(e) => setOfferAmount(e.target.value)}
                                    placeholder="Es. 250000"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Note (opzionale)
                                </label>
                                <textarea
                                    value={offerNote}
                                    onChange={(e) => setOfferNote(e.target.value)}
                                    placeholder="Aggiungi dettagli o condizioni..."
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowOfferModal(false);
                                        setOfferAmount("");
                                        setOfferNote("");
                                    }}
                                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
                                >
                                    Annulla
                                </button>
                                <button
                                    onClick={handleMakeOffer}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition-all"
                                >
                                    Invia Offerta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Controfferta */}
            {showCounterOfferModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCounterOfferModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Fai una controfferta</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Offerta originale: <strong>{formatCurrency(selectedOfferta?.importoOfferto)}</strong>
                        </p>
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nuovo importo (€)
                                </label>
                                <input
                                    type="number"
                                    value={offerAmount}
                                    onChange={(e) => setOfferAmount(e.target.value)}
                                    placeholder="Es. 270000"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Motivazione (opzionale)
                                </label>
                                <textarea
                                    value={offerNote}
                                    onChange={(e) => setOfferNote(e.target.value)}
                                    placeholder="Spiega la tua controfferta..."
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowCounterOfferModal(false);
                                        setSelectedOfferta(null);
                                        setOfferAmount("");
                                        setOfferNote("");
                                    }}
                                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
                                >
                                    Annulla
                                </button>
                                <button
                                    onClick={handleCounterOffer}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all"
                                >
                                    Invia Controfferta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Registra Offerta Esterna (solo agenti) */}
            {showManualOfferModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowManualOfferModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">📝 Registra offerta esterna</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Inserisci i dettagli di un'offerta ricevuta al di fuori del sistema
                        </p>
                        <form onSubmit={handleManualOffer}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Importo offerto (€) *
                                </label>
                                <input
                                    type="number"
                                    value={manualOfferAmount}
                                    onChange={(e) => setManualOfferAmount(e.target.value)}
                                    placeholder="Es. 250000"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Fonte dell'offerta *
                                </label>
                                <select
                                    value={manualOfferSource}
                                    onChange={(e) => setManualOfferSource(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Seleziona fonte...</option>
                                    <option value="Telefono">📞 Telefono</option>
                                    <option value="Email">✉️ Email</option>
                                    <option value="Visita">🏠 Visita in loco</option>
                                    <option value="Ufficio">🏢 Visita in ufficio</option>
                                    <option value="WhatsApp">💬 WhatsApp</option>
                                    <option value="Altro">📋 Altro</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Note aggiuntive (opzionale)
                                </label>
                                <textarea
                                    value={manualOfferNote}
                                    onChange={(e) => setManualOfferNote(e.target.value)}
                                    placeholder="Es: Cliente interessato, vuole risposta entro 3 giorni..."
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                                <p className="text-xs text-purple-800">
                                    💡 <strong>Nota:</strong> Questa offerta verrà registrata come proveniente dall'utente associato a questa chat. L'utente la vedrà nel sistema.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowManualOfferModal(false);
                                        setManualOfferAmount("");
                                        setManualOfferNote("");
                                        setManualOfferSource("");
                                    }}
                                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-all"
                                >
                                    Registra
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}