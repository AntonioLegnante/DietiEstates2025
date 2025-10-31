import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import  axios  from 'axios'

export function Registration() {
    const navigate = useNavigate();

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
            setUser({ username: "", password: "", numeroDiTelefono: "", ruolo: "" });
            navigate("/");
        })
        .catch(err => {
            console.error("Errore:", err);
            alert("Errore nella creazione dell'utente");
            setUser({ username: "", password: "", numeroDiTelefono: "", ruolo: "" });
            navigate("/");

        });
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username</label>
                <input
                     name="username"
                     value={user.username}
                     onChange={handleInputChange}>
                </input>
            </div>
            
            <div>
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    name="password" 
                    value={user.password}
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