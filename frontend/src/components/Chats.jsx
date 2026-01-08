import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Home, User, ChevronRight, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';

export function Chats() {
    const [userData, setUserData] = useState({
        utenteLoggato: "",
        ruolo: ""
    });

    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewOfferModal, setShowNewOfferModal] = useState(false);
    const [newOfferAmount, setNewOfferAmount] = useState("");
    const [newOfferNote, setNewOfferNote] = useState("");
    const [newOfferSource, setNewOfferSource] = useState("");
    const [newOfferImmobile, setNewOfferImmobile] = useState("");
    const [newOfferCliente, setNewOfferCliente] = useState("");

    const handleOpenChat = (chat) => {
        console.log("=== DEBUG APERTURA CHAT DA LISTA ===");
        console.log("Chat completa:", chat);
        console.log("Utente loggato:", userData.utenteLoggato);
        console.log("Ruolo:", userData.ruolo);

        const isAgent = userData.ruolo?.toLowerCase().includes('agente');

        let otherUsername;
        if (isAgent) {
            otherUsername = chat.utenteNome;
        } else {
            otherUsername = chat.vendorNome;
        }

        console.log("Sono agente?", isAgent);
        console.log("Altro utente:", otherUsername);
        console.log("Agente immobiliare:", chat.vendorNome);
        console.log("Utente cliente:", chat.utenteNome);

        if (otherUsername === userData.utenteLoggato) {
            console.error("❌ ERRORE: Tentativo di aprire chat con se stesso!");
            console.error("Chat data:", chat);
            alert("Errore: impossibile aprire la chat. I dati sono inconsistenti.");
            return;
        }

        navigate("/Chat", {
            state: {
                immobile: chat.immobileId,
                agenteImmobiliare: chat.vendorNome,
                utenteLoggato: userData.utenteLoggato,
                chatId: chat.chatId
            }
        });
    }

    const handleNewExternalOffer = async (e) => {
        e.preventDefault();

        if (!newOfferAmount || parseFloat(newOfferAmount) <= 0) {
            alert("Inserisci un importo valido");
            return;
        }

        if (!newOfferSource || newOfferSource.trim() === "") {
            alert("Seleziona la fonte dell'offerta");
            return;
        }

        if (!newOfferImmobile || newOfferImmobile.trim() === "") {
            alert("Inserisci l'ID o il titolo dell'immobile");
            return;
        }

        if (!newOfferCliente || newOfferCliente.trim() === "") {
            alert("Inserisci il nome/username del cliente");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const noteCompleta = `[OFFERTA ESTERNA - ${newOfferSource}] ${newOfferNote || 'Nessuna nota aggiuntiva'}`;

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/chat/newExternalOffer`,
                null,
                {
                    params: {
                        clienteUsername: newOfferCliente,
                        immobileId: parseInt(newOfferImmobile),
                        importo: parseFloat(newOfferAmount),
                        note: noteCompleta
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setShowNewOfferModal(false);
            setNewOfferAmount("");
            setNewOfferNote("");
            setNewOfferSource("");
            setNewOfferImmobile("");
            setNewOfferCliente("");

            alert("Nuova offerta esterna registrata con successo!");

            // ✅ Ricarica la lista chat invece di fare reload della pagina
            const endpoint = userData.ruolo?.toLowerCase().includes('agente')
                ? '/chat/retrieveChatsAgent'
                : '/chat/retrieveChatsUser';

            const refreshResponse = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                params: { user: userData.utenteLoggato },
                headers: { Authorization: `Bearer ${token}` }
            });

            setChats(refreshResponse.data || []);
        } catch (err) {
            console.error("Errore registrazione nuova offerta:", err);
            alert(`Errore: ${err.response?.data?.message || err.message}`);
        }
    };

    const getStatoNegoziazioneBadge = (stato) => {
        const badges = {
            APERTA: { color: 'bg-blue-100 text-blue-800', icon: MessageCircle, text: 'In corso' },
            CHIUSA_ACCETTATA: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Accettata' },
            CHIUSA_RIFIUTATA: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Chiusa' },
            SOSPESA: { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Sospesa' }
        };

        const badge = badges[stato] || badges.APERTA;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                <Icon size={12} />
                {badge.text}
            </span>
        );
    };

    const getUltimaOfferta = (offerte) => {
        if (!offerte || offerte.length === 0) return null;
        return offerte[offerte.length - 1];
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (e) {
            console.error('Invalid token:', e);
            setLoading(false);
            return;
        }

        const utente = decoded.sub ?? "";
        const ruolo = decoded.ruolo ?? decoded.roles ?? "";
        setUserData({ utenteLoggato: utente, ruolo });

        console.log("=== DEBUG CARICAMENTO LISTA CHAT ===");
        console.log("Utente:", utente);
        console.log("Ruolo:", ruolo);

        const endpoint = ruolo.toLowerCase().includes('agente')
            ? '/chat/retrieveChatsAgent'
            : '/chat/retrieveChatsUser';

        console.log("Endpoint:", endpoint);

        axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
            params: { user: utente },
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                console.log("Chat ricevute dal backend:", response.data);
                setChats(response.data || []);
            })
            .catch(err => {
                console.error('Errore nel caricamento delle chat:', err);
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    useEffect(() => {
        if (!userData.utenteLoggato) return;

        const endpoint = userData.ruolo?.toLowerCase().includes('agente')
            ? '/chat/retrieveChatsAgent'
            : '/chat/retrieveChatsUser';

        const pollInterval = setInterval(async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                    params: { user: userData.utenteLoggato },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                const newChats = response.data || [];

                if (JSON.stringify(newChats) !== JSON.stringify(chats)) {
                    console.log("🔄 Lista chat aggiornata");
                    setChats(newChats);
                }
            } catch (err) {
                console.error('Errore polling chat:', err);
            }
        }, 5000);

        return () => clearInterval(pollInterval);
    }, [userData.utenteLoggato, userData.ruolo, chats]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Caricamento negoziazioni...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                            <DollarSign size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Le tue negoziazioni</h1>
                            <p className="text-gray-600 mt-1">
                                {userData.ruolo === 'agente immobiliare' || userData.ruolo?.toLowerCase().includes('agente')
                                    ? '🏢 Vista Agente Immobiliare'
                                    : '👤 Vista Utente'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Loggato come: <strong>{userData.utenteLoggato}</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista Chat/Negoziazioni */}
                <div className="space-y-3">
                    {chats.length > 0 ? (
                        chats.map((chat, idx) => {
                            const ultimaOfferta = getUltimaOfferta(chat.offerte);
                            const hasOfferte = chat.offerte && chat.offerte.length > 0;

                            const isAgent = userData.ruolo?.toLowerCase().includes('agente');
                            const otherUserName = isAgent ? chat.utenteNome : chat.vendorNome;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleOpenChat(chat)}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-100 overflow-hidden group"
                                >
                                    <div className="p-5">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold text-xl">
                                                    {otherUserName?.charAt(0).toUpperCase() || '?'}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <User size={16} className="text-gray-500" />
                                                    <h3 className="font-bold text-gray-900 truncate">
                                                        {otherUserName}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Home size={14} className="text-gray-400" />
                                                    <span className="truncate">{chat?.immobileTitolo || `Immobile #${chat?.immobileId}`}</span>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Chat #{chat.chatId} | Vendor: {chat.vendorNome} | User: {chat.utenteNome}
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0">
                                                {getStatoNegoziazioneBadge(chat?.statoNegoziazione)}
                                            </div>

                                            <div className="flex-shrink-0">
                                                <ChevronRight
                                                    size={24}
                                                    className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {hasOfferte && ultimaOfferta && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign size={16} className="text-green-600" />
                                                        <span className="text-sm text-gray-600">Ultima offerta:</span>
                                                        <span className="text-sm font-bold text-gray-900">
                                                            {formatCurrency(ultimaOfferta.importoOfferto)}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {chat.offerte.length} {chat.offerte.length === 1 ? 'offerta' : 'offerte'}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!hasOfferte && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-sm text-gray-500 italic">Nessuna offerta ancora</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                                        chat?.statoNegoziazione === 'CHIUSA_ACCETTATA'
                                            ? 'bg-gradient-to-r from-green-600 to-green-700'
                                            : chat?.statoNegoziazione === 'CHIUSA_RIFIUTATA'
                                                ? 'bg-gradient-to-r from-red-600 to-red-700'
                                                : 'bg-gradient-to-r from-blue-600 to-purple-600'
                                    }`}></div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                            <div className="text-8xl mb-6">💰</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Nessuna negoziazione</h2>
                            <p className="text-gray-600 mb-6">
                                Non hai ancora iniziato nessuna trattativa.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                            >
                                Esplora Immobili
                            </button>
                        </div>
                    )}
                </div>

                {/* Badge conteggio */}
                {chats.length > 0 && (
                    <div className="mt-6 text-center">
                        <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                            💼 {chats.length} {chats.length === 1 ? 'negoziazione attiva' : 'negoziazioni attive'}
                        </span>
                    </div>
                )}

                {/* Bottone per registrare nuova offerta esterna (solo agenti) */}
                {(userData.ruolo === 'agente immobiliare' || userData.ruolo?.toLowerCase().includes('agente')) && (
                    <div className="mt-6">
                        <button
                            onClick={() => setShowNewOfferModal(true)}
                            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        >
                            <DollarSign size={24} />
                            <span>📝 Registra nuova offerta esterna</span>
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Registra un'offerta ricevuta al di fuori del sistema
                        </p>
                    </div>
                )}
            </div>

            {/* Modal Nuova Offerta Esterna */}
            {showNewOfferModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowNewOfferModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">📝 Registra nuova offerta esterna</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Crea una nuova negoziazione per un'offerta ricevuta fuori dal sistema
                        </p>

                        <form onSubmit={handleNewExternalOffer}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Username del cliente *
                                </label>
                                <input
                                    type="text"
                                    value={newOfferCliente}
                                    onChange={(e) => setNewOfferCliente(e.target.value)}
                                    placeholder="Es: mario_rossi"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">⚠️ Inserisci lo USERNAME (non l'email). Il cliente deve essere già registrato.</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    ID Immobile *
                                </label>
                                <input
                                    type="number"
                                    value={newOfferImmobile}
                                    onChange={(e) => setNewOfferImmobile(e.target.value)}
                                    placeholder="Es: 1"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Inserisci l'ID numerico dell'immobile</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Importo offerto (€) *
                                </label>
                                <input
                                    type="number"
                                    value={newOfferAmount}
                                    onChange={(e) => setNewOfferAmount(e.target.value)}
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
                                    value={newOfferSource}
                                    onChange={(e) => setNewOfferSource(e.target.value)}
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
                                    value={newOfferNote}
                                    onChange={(e) => setNewOfferNote(e.target.value)}
                                    placeholder="Es: Cliente molto interessato, richiesto sopralluogo..."
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                                <p className="text-xs text-purple-800 leading-relaxed">
                                    💡 <strong>Nota:</strong> Verrà creata una nuova chat tra te e il cliente specificato.
                                    L'offerta sarà visibile ad entrambi nel sistema e potrà essere accettata, rifiutata o controfferta normalmente.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowNewOfferModal(false);
                                        setNewOfferAmount("");
                                        setNewOfferNote("");
                                        setNewOfferSource("");
                                        setNewOfferImmobile("");
                                        setNewOfferCliente("");
                                    }}
                                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-all"
                                >
                                    Registra Offerta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}