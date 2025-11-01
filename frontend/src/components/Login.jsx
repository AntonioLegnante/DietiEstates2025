import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    function handleLoginButton() {
        axios.post("auth/login", {username, password})
        .then(response => {
            console.log(response.data.token)
            localStorage.setItem("token", response.data.token);
            navigate("/");
        });
    }

    return (
        <div>
            <label htmlFor="username">Username</label>
            <input id="username" onChange={e => setUsername(_ => e.target.value)}></input><br/>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={e => setPassword(_ => e.target.value)}></input><br/>
            <button onClick={handleLoginButton}>Accedi</button>
        </div>
    )
}