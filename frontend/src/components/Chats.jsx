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

    const handleOpenChat = (chat) => {
        console.log("=== DEBUG APERTURA CHAT DA LISTA ===");
        console.log("Chat completa:", chat);
        console.log("Utente loggato:", userData.utenteLoggato);
        console.log("Ruolo:", userData.ruolo);

        // Determina chi è l'altro utente in base al ruolo
        const isAgent = userData.ruolo?.toLowerCase().includes('agente');

        // L'agente immobiliare è SEMPRE il vendor
        const agenteImmobiliare = chat.vendorNome;

        console.log("Sono agente?", isAgent);
        console.log("Agente immobiliare (vendor):", agenteImmobiliare);
        console.log("Utente cliente:", chat.utenteNome);
        console.log("Chi sono io:", userData.utenteLoggato);

        navigate("/Chat", {
            state: {
                immobile: chat.immobileId,
                agenteImmobiliare: agenteImmobiliare,  // Sempre il vendor
                utenteLoggato: userData.utenteLoggato,  // Chi è loggato
                chatId: chat.chatId  // ✅ Passa anche il chatId per evitare problemi
            }
        });
    }

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

                            // Determina chi mostrare in base al ruolo
                            const isAgent = userData.ruolo?.toLowerCase().includes('agente');
                            const otherUserName = isAgent ? chat.utenteNome : chat.vendorNome;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleOpenChat(chat)}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-100 overflow-hidden group"
                                >
                                    <div className="p-5">
                                        {/* Header Card */}
                                        <div className="flex items-center gap-4 mb-3">
                                            {/* Avatar */}
                                            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold text-xl">
                                                    {otherUserName?.charAt(0).toUpperCase() || '?'}
                                                </span>
                                            </div>

                                            {/* Info principale */}
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
                                                {/* Debug info */}
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Chat #{chat.chatId} | Vendor: {chat.vendorNome} | User: {chat.utenteNome}
                                                </div>
                                            </div>

                                            {/* Stato negoziazione */}
                                            <div className="flex-shrink-0">
                                                {getStatoNegoziazioneBadge(chat?.statoNegoziazione)}
                                            </div>

                                            {/* Freccia */}
                                            <div className="flex-shrink-0">
                                                <ChevronRight
                                                    size={24}
                                                    className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Informazioni ultima offerta */}
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

                                        {/* Nessuna offerta ancora */}
                                        {!hasOfferte && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-sm text-gray-500 italic">Nessuna offerta ancora</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Linea colorata in basso */}
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
            </div>
        </div>
    );
}