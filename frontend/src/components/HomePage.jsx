import axios from 'axios'
import { useState } from 'react';
import { CardEstates } from './CardEstates.jsx';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function SearchFilter({ setImmobili }) {
    const [localita, setLocalita] = useState("")
    const [minPrezzo, setMinPrezzo] = useState(0);
    const [maxPrezzo, setMaxPrezzo] = useState(0);
    const [affitta, setAffitta] = useState(false);
    const [acquisto, setAcquisto] = useState(false);
    const [altriFiltriCheck, setAltriFiltri] = useState(false);

    const altriFiltri = <>
            <label htmlFor='numero di stanze'>Numero di stanze: </label>
            <input type="number" id="numero di stanze"></input>
            <label htmlFor='dimensione'>Dimensione:</label>
            <input id="dimensione"></input>
            <select>Classe energetica:
                <option value="A1">A1</option>
                <option value="A2">A2</option>
            </select>
            <br/>
        </>
        
    
    return (
        <div>
                <label htmlFor="località">Inserisci la tua località</label>
                <input id="località" onChange={e => setLocalita(_ => e.target.value)}></input><br/>
                <label htmlFor="prezzo">Prezzo
                    <label htmlFor="da">Da:</label> 
                        <input type="number" id="da" onChange={e => setMinPrezzo(_ => e.target.value)}></input> 
                    <label htmlFor="a">a:</label> 
                        <input type="number" id="a" onChange={e => setMaxPrezzo(_ => e.target.value)}></input> 
                </label>
                <input type="checkbox" name="tipo" value={true} id="affitto" onChange={e => setAffitta(_ => e.target.value)}></input>
                <label htmlFor="affitto">Affitto</label>
                <input type="checkbox" name="tipo" value={true} id="vendita" onChange={e => setAcquisto(_ => e.target.value)}></input>
                <label htmlFor="vendita">Vendita</label>
                <button onClick={() => setAltriFiltri(_ => !altriFiltriCheck)}>Altri filtri</button><br/>
                {altriFiltriCheck ? altriFiltri : null}
                <button onClick={() => axios.get("http://localhost:8080/api/immobili/ricerca",{
                                            params: {
                                                localita,
                                                minPrezzo,
                                                maxPrezzo,
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
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/immobile/${id}`);
    };

    return (
    <div>
      <div>
        <h1>
          I Nostri Immobili
        </h1>
        
        <div>
          {immobili.map((immobile) => (
            <div onClick={() => handleClick(immobile.id)}>
                <CardEstates
                    key={immobile.id}
                    immobile={immobile}
                />
            </div>
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
    const [immobili, setImmobili] = useState([{
        id: 'IMM001',
    titolo: 'Elegante Appartamento in Centro Storico',
    indirizzo: 'Via Dante, 15 - Milano',
    prezzo: 450000,
    descrizione: 'Splendido appartamento di 120 mq situato nel cuore del centro storico di Milano. L\'immobile si trova al terzo piano di un elegante palazzo d\'epoca con ascensore e si compone di ingresso, ampio salone, cucina abitabile, tre camere da letto e due bagni. Completamente ristrutturato con finiture di pregio.',
    linkImmagine: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    coordinate: {
      lat: 45.4642,
      lng: 9.1900
    }
    }]);
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