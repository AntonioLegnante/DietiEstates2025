
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx'; // Importa useAuth invece di login
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth(); // Ottieni login dal contesto

    function handleLoginButton() {
        axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {username, password})
            .then(response => {
                console.log(response.data.token);
                login(response.data.token);
                let ruolo = jwtDecode(response.data.token)?.roles;
                console.log(`In login: ${ruolo}`);
                if (ruolo == "Amministratore" || ruolo == "nuovoAmministratore") {
                    console.log("In login entro nel if nuovo amministratore");
                    navigate("/paginaAmministratore");
                }
                else {
                    navigate("/");
                }
            })
            .catch(error => {
                console.error("Errore durante il login:", error);
                alert("Errore nel login");
            });
    }

    return (
        <div>
            <label htmlFor="username">Username</label>
            <input id="username" onChange={e => setUsername(e.target.value)}></input><br/>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={e => setPassword(e.target.value)}></input><br/>
            <button onClick={handleLoginButton}>Accedi</button>
        </div>
    )
}