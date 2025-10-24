import { useState } from 'react'
import  axios  from 'axios'

export function Registration() {
    const [user, setUser] = useState({
        username: "",
        password: "",
        numeroDiTelefono: "",
        ruolo: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev, 
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(user);
        axios.post("http://localhost:8080/auth/registrazione", 
            user)
        .then(res => {
            console.log("Utente creato:", res.data);
            alert("Utente creato con successo!");
            // Reset form
            setUser({ username: "", password: "", numeroDiTelefono: "", ruolo: "" });
        })
        .catch(err => {
            console.error("Errore:", err);
            alert("Errore nella creazione dell'utente");
        });
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username</label>
                <input
                     name="username"
                     onChange={handleInputChange}>
                </input>
            </div>
            
            <div>
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    name="password" 
                    onChange={handleInputChange}>
                </input>
            </div>
            
            <div>
                <label>Numero di telefono</label>
                <input 
                    name="numeroDiTelefono" 
                    onChange={handleInputChange}>
                </input>
            </div>
           
            <div>
                <input 
                    type="radio" 
                    name="ruolo" 
                    value="agente immobiliare" 
                    onChange={handleInputChange}>
                </input>
                <label>Agente immobiliare</label>

                <input 
                    type="radio" 
                    name="ruolo" 
                    value="utente"
                    onChange={handleInputChange}>
                </input>
                <label>Utente</label><br/>
            </div>
            
            <button type="submit">Conferma</button>
        </form>
    )
}