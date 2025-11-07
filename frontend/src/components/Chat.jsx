import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function Chat(){
    const [messaggi, setMessaggi] = useState([]);
    const [messaggio, setMessaggio] = useState("");
    const [chatId, setChatId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const location = useLocation();
    const { immobile, agenteImmobiliare, utenteLoggato } = location.state || {};

    console.log(`${immobile}, ${agenteImmobiliare}, ${utenteLoggato}`);

    function addMessage() {
        axios.get("http://localhost:8080/chat/addMessage", {
            params: {
                chatId: chatId,
                messaggio: messaggio
            },
            headers: {
                Authorization: `Bearer ${token}`
            }

        });
        setMessaggi(prev => [...prev, {
            messageContent: messaggio
        }]);
    }

    useEffect(()=>{
        setLoading(true);
        setError(null);
        // backend controller maps to /chat/openChat and expects params 'user', 'vendor', 'immobile'
        // use full backend URL to avoid relying on dev-server proxy
        axios.get("http://localhost:8080/chat/openChat",  { 
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
            console.log(`prova ${response.data.messaggi}`);
            console.log(`chat id: ${response.data.chatId}`);
            console.log(`Sender id: ${response.data.senderId}`);
            console.log(`Receiver id: ${response.data.receiverId}`);
            console.log(`Estate id: ${response.data.immobileId}`);
            console.log(`primo messaggio: ${response.data.messaggi[0]}`);
            setChatId(_ => response.data.chatId);
            setMessaggi(_ => response.data.messaggi)
        })
        .catch(err => {
            console.error("Failed to load chat:", err);
            // Surface useful info for 4xx/5xx responses
            if (err.response) {
                console.error('Status', err.response.status, 'data', err.response.data);
            }
            setError(err);
        })
        .finally(() => setLoading(false));
    }, [immobile, agenteImmobiliare, utenteLoggato]);

    if (loading) return (<div>
        Caricamento conversazione…</div>);
    if (error) {
        // log useful debug info outside of JSX (JSX expressions must be expressions, not statements)
        console.log('Chat error - immobile:', immobile);
        console.log('Chat error - vendor:', agenteImmobiliare);
        console.log('Chat error - utente:', utenteLoggato);
        return (<div>Errore nel caricamento della chat.</div>);
    }
    return (
        <div>
            {
                messaggi ?
                messaggi.map((messaggio, id) => (
                    <div key={id}>
                        {messaggio.messageContent}
                    </div> 
                )) : null
            }
            <div>
                <label>Inserisci messaggio</label>
                <input onChange={e => setMessaggio(_ => e.target.value)}>
                </input>
                <label>Invia messaggio</label>
                <button onClick={addMessage}>
                    Invia Messaggio
                </button>
            </div>
        </div>
    );
}


