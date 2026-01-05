import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Send, ArrowLeft, Home } from 'lucide-react';

export function Chat(){
    const [messaggi, setMessaggi] = useState([]);
    const [messaggio, setMessaggio] = useState("");
    const [chatId, setChatId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [senderId, setSenderId] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [otherUserName, setOtherUserName] = useState(""); // Nome dell'altro utente
    const token = localStorage.getItem("token");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const location = useLocation();
    const { immobile, agenteImmobiliare, utenteLoggato } = location.state || {};

    console.log(`Immobile: ${immobile}, Agente: ${agenteImmobiliare}, Utente: ${utenteLoggato}`);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messaggi]);

    function addMessage(e) {
        e.preventDefault();
        if (!messaggio.trim()) return;

        setSendingMessage(true);

        axios.get(`${import.meta.env.VITE_API_URL}/chat/addMessage`, {
            params: {
                chatId: chatId,
                messaggio: messaggio
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                // Il backend ora restituisce il messaggio con il senderId corretto
                setMessaggi(prev => [...prev, {
                    messageContent: response.data.messageContent,
                    senderId: response.data.senderId
                }]);
                setMessaggio("");
            })
            .catch(err => {
                console.error("Errore nell'invio del messaggio:", err);
                alert("Errore nell'invio del messaggio");
            })
            .finally(() => {
                setSendingMessage(false);
            });
    }

    useEffect(()=>{
        setLoading(true);
        setError(null);

        axios.get(`${import.meta.env.VITE_API_URL}/chat/openChat`,  {
            params: {
                user: utenteLoggato,
                vendor: agenteImmobiliare,
                immobile: immobile,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('=== DEBUG CHAT ===');
                console.log('Utente loggato:', utenteLoggato);
                console.log('Agente:', agenteImmobiliare);
                console.log('My sender ID:', response.data.senderId);
                console.log('Receiver ID:', response.data.receiverId);
                console.log('Username Receiver:', response.data.usernameReceiver);
                console.log('Messaggi ricevuti:', response.data.messaggi);

                response.data.messaggi?.forEach((msg, idx) => {
                    console.log(`Msg ${idx}: "${msg.messageContent}" - senderId: ${msg.senderId}`);
                });

                setChatId(response.data.chatId);
                setSenderId(response.data.senderId);
                setReceiverId(response.data.receiverId);
                setOtherUserName(response.data.usernameReceiver); // Salva il nome dell'altro utente
                setMessaggi(response.data.messaggi || []);
            })
            .catch(err => {
                console.error("Failed to load chat:", err);
                if (err.response) {
                    console.error('Status', err.response.status, 'data', err.response.data);
                }
                setError(err);
            })
            .finally(() => setLoading(false));
    }, [immobile, agenteImmobiliare, utenteLoggato]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Caricamento conversazione...</p>
                </div>
            </div>
        );
    }

    if (error) {
        console.log('Chat error - immobile:', immobile);
        console.log('Chat error - vendor:', agenteImmobiliare);
        console.log('Chat error - utente:', utenteLoggato);
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Errore</h2>
                    <p className="text-gray-600 mb-6">Impossibile caricare la chat. Bisogna essere registrati.</p>
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Header Chat */}
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
                                    <span className="truncate">Immobile: {immobile}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Area Messaggi */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messaggi && messaggi.length > 0 ? (
                        messaggi.map((msg, id) => {
                            // Usa il senderId dal backend
                            const isMyMessage = msg.senderId === senderId;

                            console.log(`Rendering msg ${id}:`, {
                                content: msg.messageContent,
                                msgSenderId: msg.senderId,
                                mySenderId: senderId,
                                isMyMessage: isMyMessage
                            });

                            // Determina il nome da mostrare
                            let displayName = '';
                            if (isMyMessage) {
                                displayName = 'Tu';
                            } else {
                                displayName = otherUserName || 'Altro utente';
                            }

                            return (
                                <div
                                    key={id}
                                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex flex-col gap-1 ${isMyMessage ? 'items-end' : 'items-start'}`}>
                                        {/* Nome mittente */}
                                        <span className={`text-xs font-semibold px-2 ${
                                            isMyMessage ? 'text-blue-600' : 'text-gray-600'
                                        }`}>
                                            {displayName}
                                        </span>

                                        {/* Bolla messaggio */}
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                                                isMyMessage
                                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                                                    : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                                            }`}
                                        >
                                            <p className="break-words">{msg.messageContent}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">💬</div>
                            <p className="text-gray-500 text-lg">Nessun messaggio ancora</p>
                            <p className="text-gray-400 text-sm mt-2">Inizia la conversazione!</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Messaggio */}
            <div className="bg-white border-t border-gray-200 sticky bottom-0">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <form onSubmit={addMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={messaggio}
                            onChange={e => setMessaggio(e.target.value)}
                            placeholder="Scrivi un messaggio..."
                            disabled={sendingMessage}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
                        />
                        <button
                            type="submit"
                            disabled={sendingMessage || !messaggio.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                            {sendingMessage ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Send size={20} />
                                    <span className="hidden sm:inline">Invia</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}