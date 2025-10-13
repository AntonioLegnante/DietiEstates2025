import axios from 'axios'
import { useState, useEffect } from 'react';

function SearchFilter() {
    const [prova, setProva] = useState("");
    return (
        <div>
                <label htmlFor="località">Inserisci la tua località</label>
                <input id="località"></input><br/>
                <label htmlFor="distanza">Distanza</label>
                <select name="distanza" id="distanza">
                    <option value="10km">Entro 10km</option>
                    <option value="25km">Entro 25km</option>
                    <option value="50km">Entro 50km</option>
                </select>
                <label htmlFor="prezzo">Prezzo</label>
                <select name="prezzo" id="prezzo">
                    <option value="lt400">Meno di 400</option>
                    <option value="lt800">Meno di 800</option>
                    <option value="lt1000">Meno di 1000</option>
                </select>
                <input type="checkbox" name="tipo" value="affitto" id="affitto"></input>
                <label htmlFor="affitto">Affitto</label>
                <input type="checkbox" name="tipo" value="acquisto" id="acquisto"></input>
                <label htmlFor="acquisto">Acquisto</label>
                <button onClick={() => axios.get("api/v1")
                                                        .then(response =>{
                                                            console.log(response.data)
                                                            setProva(_ => response.data[0].firstname)
                                                        })
                }>Filtra</button>
                {prova}
        </div>
    )
}

function EstatesList() {
    return (
        <div>
            <ol>
                {}
            </ol>
        </div>
    )
}
export function HomePage() {
    return (
        <div>
            <SearchFilter />
            <EstatesList />
            <h1>ToDo</h1>
        </div>
    )
}