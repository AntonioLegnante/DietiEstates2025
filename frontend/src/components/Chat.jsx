import axios from 'axios';
import { MapPin, Home, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Chat({immobile, vendor, utente}){
    const [messaggi, setMessaggi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(()=>{
        setLoading(true);
        setError(null);
        // backend controller maps to /chat/openChat and expects params 'user', 'vendor', 'immobile'
        // use full backend URL to avoid relying on dev-server proxy
        axios.get("http://localhost:8080/chat/openChat",  { 
            params: {
                user: utente,
                vendor: vendor,
                immobile: immobile,
                
            }, headers: {
                Authorization: `Bearer ${token}`
                 }
            })
        .then(response => {
            // Ensure we always store an array
            // backend returns a Chat object — adapt to response shape
            // if the backend returns messages inside response.data.messaggi use that, otherwise
            // fallback to the whole response data (wrapped in an array for map)
            const data = response?.data;
            if (Array.isArray(data?.messaggi)) setMessaggi(data.messaggi);
            else if (Array.isArray(data)) setMessaggi(data);
            else if (data) setMessaggi([data]);
            else setMessaggi([]);
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
    }, [immobile, vendor, utente]);

    if (loading) return (<div>
        Caricamento conversazione…</div>);
    if (error) {
        // log useful debug info outside of JSX (JSX expressions must be expressions, not statements)
        console.log('Chat error - immobile:', immobile);
        console.log('Chat error - vendor:', vendor);
        console.log('Chat error - utente:', utente);
        return (<div>Errore nel caricamento della chat.</div>);
    }
    return (
        <div>
            {
                messaggi.map((messaggio, idx) => (
                    <div key={messaggio?.id ?? idx}>
                        {typeof messaggio === 'string' ? messaggio : JSON.stringify(messaggio)}
                    </div>
                ))
            }
        </div>
    );
}


