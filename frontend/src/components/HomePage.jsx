import axios from 'axios'
import { useState, useEffect } from 'react';
import { CardEstates } from './CardEstates.jsx';
import { Home } from 'lucide-react';

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
    const [immobili, setImmobili] = useState([
    {
      id: 1,
      titolo: "Villa moderna con piscina",
      descrizione: "Splendida villa di recente costruzione con ampio giardino, piscina e finiture di pregio. Ideale per famiglie che cercano comfort e tranquillità.",
      prezzo: 450000,
      indirizzo: "Via dei Platani 42, Milano",
      imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"
    }]);

    return (
    <div>
      <div>
        <h1>
          I Nostri Immobili
        </h1>
        
        <div>
          {immobili.map((immobile) => (
            <CardEstates
              key={immobile.id}
              immobile={immobile}
            />
          ))}
        </div>

        {immobili.length === 0 && (
          <div>
            <Home />
            <p>Nessun immobile disponibile</p>
          </div>
        )}
      </div>
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