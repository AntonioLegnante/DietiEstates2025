import axios from 'axios'
import { useState } from 'react';
import { CardEstates } from './CardEstates.jsx';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';



function SearchFilter({ setImmobili }) {
    const [localita, setLocalita] = useState("");
    const [minPrezzo, setMinPrezzo] = useState(0);
    const [maxPrezzo, setMaxPrezzo] = useState(0);
    const [affitta, setAffitta] = useState(false);
    const [vendita, setVendita] = useState(false);
    const [numeroStanze, setNumeroStanze] = useState(1);
    const [dimensione, setDimensione] = useState(null);
    const [piano, setPiano] = useState(null);
    const [classeEnergetica, setClasseEnergetica] = useState(null);
    const [altriFiltriCheck, setAltriFiltri] = useState(false);

    const altriFiltri = <>
            <label htmlFor='numero di stanze'>Numero di stanze: </label>
            <input type="number" id="numero di stanze" onChange={e => setNumeroStanze(_ => e.target.value)}></input>
            <label htmlFor='dimensione'>Dimensione:</label>
            <input id="dimensione" onChange={e => setDimensione(_ => e.target.value)}></input>
            <label htmlFor='piano'>Piano:</label>
            <input id='piano' onChange={e => setPiano(_ => e.target.value)}></input>
            <select onChange={e => setClasseEnergetica(_ => e.target.value)}>Classe energetica:
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
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
                <input type="checkbox" name="tipo" checked={affitta} id="affitto" onChange={e => setAffitta(_ => e.target.checked)}></input>
                <label htmlFor="affitto">Affitto</label>
                <input type="checkbox" name="tipo" checked={vendita} id="vendita" onChange={e => setVendita(_ => e.target.checked)}></input>
                <label htmlFor="vendita">Vendita</label>
                <button onClick={() => setAltriFiltri(_ => !altriFiltriCheck)}>Altri filtri</button><br/>
                {altriFiltriCheck ? altriFiltri : null}
                <button onClick={() => axios.get("http://localhost:8080/api/immobili/ricerca", {
                                            params: {
                                                localita,
                                                minPrezzo,
                                                maxPrezzo,
                                                affitta,
                                                vendita,
                                                numeroStanze, 
                                                dimensione,
                                                piano,
                                                classeEnergetica
                                            }})
                                            .then(response =>{
                                                    console.log(response.data);
                                                    setImmobili(_ => response.data)
                                                    
                                            })
                }>Cerca</button>
        </div>
    )
}

function EstatesList({ immobili, utenteRegistrato }) {
    const navigate = useNavigate();

    const handleClick = (immobile) => {
        navigate(`/immobile/${immobile.id}`, {
            state: { immobile }
        });
    };

    return (
    <div>
      <div>
        <h1>
          I Nostri Immobili
        </h1>
        
        <div>
          {immobili.map((immobile) => (
            <div onClick={() => handleClick(immobile)}>
                <CardEstates
                    key={immobile.id}
                    immobile={immobile}
                    utente={utenteRegistrato}

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
 
   // const location = useLocation();
   // const userData = location.state?.userData;
    
   const [userData,setUserData] = useState(() => localStorage.getItem("token"));
   console.log(userData);

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
    }, 
    agenteImmobiliare: 'gormita'
    }]);
    return (
        <div>
            {userData ? userData : null}
            <SearchFilter setImmobili={setImmobili}/>
            <EstatesList immobili={immobili} 
                utenteRegistrato={userData}
            />
            <button onClick={() => {
                localStorage.removeItem("token");
                setUserData(null);
            }}>Logout</button>
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