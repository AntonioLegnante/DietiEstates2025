import { useState } from 'react'
import { useAuth } from './AuthContext.jsx';
import axios from 'axios';

export function AdministratorPage() {
    const {username, ruolo, setRuolo } = useAuth();

    const [administrator, setAdministrator] = useState({
        username: username,
        password: "",
        numeroDiTelefono: "",
        ruolo: ruolo
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${import.meta.env.VITE_API_URL}/auth/registrazione`,
            administrator)
        .then(res => {
            console.log(res.data);
            alert(res.data);
            setAdministrator({ username: "", password: "", numeroDiTelefono: "N/A", ruolo: "nuovoAmministratore" });
        })
        .catch(err => {
            console.error(err.data);
            alert(err.data);
            setAdministrator({ username: "", password: "", numeroDiTelefono: "N/A", ruolo: "nuovoAmministratore" });
        });
    }

    const handleChangePassword = () => {
        const payload = { ...administrator, ruolo: "Amministratore" };
        axios.post(`${import.meta.env.VITE_API_URL}/auth/cambiaPassword`,
            payload)
        .then(res => {
            console.log(res.data);
            alert(res.data);
            setRuolo(_ => "Amministratore")
            setAdministrator({ username: "", password: "", numeroDiTelefono: "N/A", ruolo: "nuovoAmministratore" });
        })
        .catch(err => {
            console.error(err.response.data);
            alert(err.response.data);
            setAdministrator({ username: "", password: "", numeroDiTelefono: "N/A", ruolo: "nuovoAmministratore" });
        });
    }

    const firstAccessPage = <div>
        <p>Si prega di cambiare la password</p>
        <label 
            htmlFor='nuovaPassword'>
            Nuova password:
        </label>
        <input 
            id='nuovaPassword'
            type='password'
            onChange={e => setAdministrator(prev => ({
                ...prev, 
                password: e.target.value
            }))}>
        </input>
        <button onClick={handleChangePassword}>
            Conferma
        </button>
    </div>

    const insertNewAmministrator = <div>
        <label 
            htmlFor='usernameAmn'>
            Username:
        </label>
        <input
            id='usernameAmn'
            onChange={e => setAdministrator(prev => ({
                ...prev, 
                username: e.target.value
            }))}>
        </input>

        <label 
            htmlFor='passwordAmn'>
            Password:
        </label>
        <input
            id='passwordAmn'
            type='password'
            onChange={e => setAdministrator(prev => ({
                ...prev, 
                password: e.target.value
            }))}
        >
        </input>

        <label 
            htmlFor='numeroDiTelefonoAmn'>
            numero di telefono:
        </label>
        <input
            id='numeroDiTelefonoAmn'
            onChange={e => setAdministrator(prev => ({
                ...prev, 
                numeroDiTelefono: e.target.value
            }))}>
        </input>

        <button onClick={handleSubmit}>
            Conferma
        </button>
    </div>

    return (
        <>
            {ruolo === "nuovoAmministratore" ? firstAccessPage : insertNewAmministrator}
        </>
    )
}

