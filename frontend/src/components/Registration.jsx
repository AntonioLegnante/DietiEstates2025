import { useState } from 'react'

export function Registration() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [numeroDiTelefono, setNumeroDiTelefono] = useState("");
    const [user, setUser] = useState("");

    return (
        <div>
            <form>
                <label htmlFor="username">Username</label>
                <input id="username" onChange={e => setUsername(_ => e.target.value)}></input><br/>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={e => setPassword(_ => e.target.value)}></input><br/>
                <label htmlFor="numero di telefono">Numero di telefono</label>
                <input id="numero di telefono" onChange={e => setNumeroDiTelefono(_ => e.target.value)}></input><br/>
                <input type="radio" name="user" value="agente immobiliare" id="agente immobiliare" onChange={e => setUser(_ => e.target.value)}></input>
                <label htmlFor="agente immobiliare">Agente immobiliare</label>
                <input type="radio" name="user" value="utente" id="utente"  onChange={e => setUser(_ => e.target.value)}></input>
                <label htmlFor="utente">Utente</label><br/>
                <button type="submit">Conferma</button>
            </form>
        </div>
    )
}