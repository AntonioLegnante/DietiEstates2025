import { MapPin, Home, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { MapView } from './MapView.jsx';
import { Chat } from './Chat.jsx'
import { useNavigate } from 'react-router-dom';

export function CardEstates({ immobile, utenteLoggato }) {

  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div>
        {/* Immagine */}
        <div className="relative">
          <img
            src={immobile.linkImmagine}
            alt={immobile.titolo}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Immagine+non+disponibile';
            }}
          />
          <div>
            {formatPrice(immobile.prezzo)}
          </div>
          <div>
            <ExternalLink />
          </div>
        </div>

        {/* Contenuto */}
        <div className="p-6">
          {/* Titolo */}
          <h3>
            {immobile.titolo}
          </h3>

          {/* Indirizzo */}
          <div>
            <MapPin />
            <span>{immobile.indirizzo}</span>
          </div>

          {/* Descrizione */}
          <p>
            {immobile.descrizione}
          </p>

          {/* Mappa piccola */}
          {immobile.coordinate && (
            <div>
              <MapView 
                lat={immobile.coordinate.lat} 
                lng={immobile.coordinate.lng} 
                address={immobile.indirizzo}
              />
            </div>
          )}

          {/* Info aggiuntive */}
          <div>
            <div>
              <Home />
              <span>ID: {immobile.id}</span>
            </div>
          </div>
        </div>

        <div>
          {/*<Chat immobile={immobile.id}
                vendor={immobile.vendor}
                utente={utenteRegistrato}
          />
        */}
        <div>
          {immobile.agenteImmobiliare}
        </div>
        <div>
          {utenteLoggato}
        </div>
        <button onClick={(e) => {
          // prevent the outer div's onClick from running
          e.stopPropagation();
          // pass a state object to the route (don't use the comma expression)
          navigate('/Chat', { 
            state: { 
              immobile: immobile.id, 
              agenteImmobiliare: immobile.agenteImmobiliare, 
              utenteLoggato: utenteLoggato 
            } 
          });
        }}>
          Messaggia
        </button>
        </div>
      </div>
    </>
  );
}

