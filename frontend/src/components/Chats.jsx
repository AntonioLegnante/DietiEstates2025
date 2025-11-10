import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export function Chats() {
    const [userData, setUserData] = useState({
        utenteLoggato: "",
        ruolo: ""
    });
    
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (e) {
            console.error('Invalid token:', e);
            return;
        }
        
        const utente = decoded.sub ?? "";
        const ruolo = decoded.ruolo ?? decoded.roles ?? "";
        setUserData({ utenteLoggato: utente, ruolo });
        console.log(`utente loggato ${utente} ruolo: ${ruolo}`);
        
        if (ruolo.toLowerCase().includes('agente')) {
            axios.get("http://localhost:8080/chat/retrieveChatsAgent", {
                params: { user: utente },
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setChats(response.data || []);
            })
            .catch(err => console.error(err));
        } else {
            // fallback: endpoint per utenti normali o nessuna azione
        }
        
    }, []);
    
    return (
        <>
            <h1>{userData.ruolo}</h1>
            {chats.map((chat, idx) => (
                <div key={idx}>
                    <span>{chat?.senderId}</span>
                    <span>{chat?.immobileId}</span>
                </div>
            ))}

        </>
    )
}

