import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Home, User, ChevronRight } from 'lucide-react';

export function Chats() {
    const [userData, setUserData] = useState({
        utenteLoggato: "",
        ruolo: ""
    });

    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleOpenChat = (immobile, agenteImmobiliare, utenteLoggato) => {
        navigate("/Chat", {
            state: {
                immobile: immobile,
                agenteImmobiliare: agenteImmobiliare,
                utenteLoggato: utenteLoggato
            }
        });
    }

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
        console.log(`utente loggato ${utente} ruolo: ${ruolo}`);

        const endpoint = ruolo.toLowerCase().includes('agente')
            ? '/chat/retrieveChatsAgent'
            : '/chat/retrieveChatsUser';

        axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
            params: { user: utente },
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
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
                    <p className="text-xl font-semibold text-gray-700">Caricamento chat...</p>
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
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                            <MessageCircle size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Le tue conversazioni</h1>
                            <p className="text-gray-600 mt-1">
                                {userData.ruolo === 'agente immobiliare' || userData.ruolo?.toLowerCase().includes('agente')
                                    ? '🏢 Vista Agente Immobiliare'
                                    : '👤 Vista Utente'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista Chat */}
                <div className="space-y-3">
                    {chats.length > 0 ? (
                        chats.map((chat, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleOpenChat(
                                    chat?.immobileId,
                                    chat?.usernameReceiver,
                                    chat?.usernameSender
                                )}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-100 overflow-hidden group"
                            >
                                <div className="p-5 flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-xl">
                                            {chat?.usernameReceiver?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    </div>

                                    {/* Info Chat */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User size={16} className="text-gray-500" />
                                            <h3 className="font-bold text-gray-900 truncate">
                                                {chat?.usernameSender} ↔ {chat?.usernameReceiver}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Home size={14} className="text-gray-400" />
                                            <span className="truncate">Immobile: {chat?.immobileId}</span>
                                        </div>
                                    </div>

                                    {/* Freccia */}
                                    <div className="flex-shrink-0">
                                        <ChevronRight
                                            size={24}
                                            className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Linea colorata in basso */}
                                <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                            <div className="text-8xl mb-6">💬</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Nessuna conversazione</h2>
                            <p className="text-gray-600 mb-6">
                                Non hai ancora iniziato nessuna chat.
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
                        <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                            📊 {chats.length} {chats.length === 1 ? 'conversazione attiva' : 'conversazioni attive'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}