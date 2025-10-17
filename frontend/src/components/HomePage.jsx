import axios from 'axios'
import { useState, useEffect } from 'react';
import { CardEstates } from './CardEstates.jsx';
import { Home } from 'lucide-react';

function SearchFilter({ setImmobili }) {
    const [prova, setProva] = useState("");
    const [localita, setLocalita] = useState("")
    const [distanza, setDistanza] = useState("");
    const [prezzo, setPrezzo] = useState(0);
    const [affitta, setAffitta] = useState(false);
    const [acquisto, setAcquisto] = useState(false);
    
    return (
        <div>
                <label htmlFor="località">Inserisci la tua località</label>
                <input id="località" onChange={e => setLocalita(_ => e.target.value)}></input><br/>
                <label htmlFor="distanza">Distanza</label>
                <select name="distanza" id="distanza">
                    <option value="10km">Entro 10km</option>
                    <option value="25km">Entro 25km</option>
                    <option value="50km">Entro 50km</option>
                </select>
                <label htmlFor="prezzo">Prezzo</label>
                <select name="prezzo" id="prezzo" onChange={e => setPrezzo(_ => e.target.value)}>
                    <option value={400}>Meno di 400</option>
                    <option value={800}>Meno di 800</option>
                    <option value={1000}>Meno di 1000</option>
                </select>
                <input type="checkbox" name="tipo" value={true} id="affitto" onChange={e => setAffitta(_ => e.target.value)}></input>
                <label htmlFor="affitto">Affitto</label>
                <input type="checkbox" name="tipo" value={true} id="acquisto" onChange={e => setAcquisto(_ => e.target.value)}></input>
                <label htmlFor="acquisto">Acquisto</label>
                <button onClick={() => axios.get("http://localhost:8080/api/immobili/ricerca",{
                                            params: {
                                                localita,
                                                prezzo,
                                                affitta,
                                                acquisto
                                            }})
                                            .then(response =>{
                                                    console.log(response.data);
                                                    setImmobili(_ => response.data)
                                            })
                }>Cerca</button>
        </div>
    )
}

function EstatesList({ immobili }) {
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
    const [immobili, setImmobili] = useState([]);
    return (
        <div>
            <SearchFilter setImmobili={setImmobili}/>
            <EstatesList immobili={immobili} />
            <h1>ToDo</h1>
        </div>
    )
}

/*  id: 1,
      titolo: "Villa moderna con piscina",
      descrizione: "Splendida villa di recente costruzione con ampio giardino, piscina e finiture di pregio. Ideale per famiglie che cercano comfort e tranquillità.",
      prezzo: 450000,
      indirizzo: "Via dei Platani 42, Milano",
      imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"
    }]);*/