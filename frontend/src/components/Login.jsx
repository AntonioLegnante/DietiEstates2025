import { useState } from 'react';

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <form>
                <label htmlFor="username">Username</label>
                <input id="username" onChange={e => setUsername(_ => e.target.value)}></input><br/>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={e => setPassword(_ => e.target.value)}></input><br/>
                <button type="submit">Accedi</button>
            </form>
        </div>
    )
}