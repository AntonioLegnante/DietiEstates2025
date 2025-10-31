import { useState } from "react"
import axios from 'axios'

/*
stanze: "",
        ascensore: "",
        classeEnergetica: "",
        affitto: "",
        vendite: "",
        longitudine: "",
        latitudine: "",
*/
export function EstatesMask() {
    const [formData, setFormData] = useState({
        titolo: "",
        descrizione: "",
        citta: "",
        prezzo: "",
        dimensione: "",
        indirizzo: "",
        affitto: false,
        vendita: false
    });
    const [file, setFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBooleanInputChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }))
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!file) {
            alert("Seleziona un'immagine!");
            return;
        }

        // Crea FormData con file + dati
        const data = new FormData();
        data.append("file", file);
        data.append("titolo", formData.titolo);
        data.append("descrizione", formData.descrizione);
        data.append("prezzo", formData.prezzo);
        data.append("dimensione", formData.dimensione);
        data.append("citta", formData.citta);
        data.append("indirizzo", formData.indirizzo);
        data.append("affitto", formData.affitto);
        data.append("vendita", formData.vendita);

        axios.post("http://localhost:8080/api/immobili", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then(res => {
            console.log("Immobile creato:", res.data);
            alert("Immobile creato con successo!");
            setFormData({ titolo: "", descrizione: "", dimensione: "", prezzo: "", formData: "", citta: "", indirizzo: "", affitto: false, vendita: false});
            setFile(null);
        })
        .catch(err => {
            console.error("Errore:", err);
            alert("Errore nella creazione dell'immobile");
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Titolo:</label>
                <input 
                    type="text" 
                    name="titolo"
                    value={formData.titolo}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Descrizione:</label>
                <textarea 
                    name="descrizione"
                    value={formData.descrizione}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Prezzo (€):</label>
                <input 
                    type="number" 
                    name="prezzo"
                    value={formData.prezzo}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Dimensione:</label>
                <input 
                    type="text" 
                    name="dimensione"
                    value={formData.dimensione}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Citta:</label>
                <input 
                    type="text"
                    name="citta"
                    value={formData.citta}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Indirizzo:</label>
                <input 
                    type="text" 
                    name="indirizzo"
                    value={formData.indirizzo}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Affitto:</label>
                <input 
                    type="checkbox" 
                    name="affitto"
                    checked={formData.affitto}
                    onChange={handleBooleanInputChange}
                />
                <label>Vendita:</label>
                <input 
                    type="checkbox" 
                    name="vendita"
                    checked={formData.vendita}
                    onChange={handleBooleanInputChange}
                />
            </div>

            <div>
                <label>Immagine:</label>
                <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                />
            </div>

            <button type="submit">Crea Immobile</button>
        </form>
    );
}