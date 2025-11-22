import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Chats() {
    const [userData, setUserData] = useState({
        utenteLoggato: "",
        ruolo: ""
    });
    

    const navigate = useNavigate();

    const [chats, setChats] = useState([]);

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
            axios.get(`${import.meta.env.VITE_API_URL}/chat/retrieveChatsAgent`, {
                params: { user: utente },
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setChats(response.data || []);
            })
            .catch(err => console.error(err));
        } else {
            axios.get(`${import.meta.env.VITE_API_URL}/chat/retrieveChatsUser`, {
                params: { user: utente },
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setChats(response.data || []);
            })
            .catch(err => console.error(err));
        }
        
    }, []);
    
    return (
        <>
            <h1>{userData.ruolo}</h1>
            {chats.map((chat, idx) => (
                <div key={idx} onClick={() => handleOpenChat(
                        chat?.immobileId, 
                        chat?.usernameReceiver, 
                        chat?.usernameSender)
                    }>
                    <span>{chat?.usernameSender}</span>
                    <span>{chat?.usernameReceiver}</span>
                    <span>{chat?.immobileId}</span>
                </div>
            ))}
        </>
    )
}

