import { MapPin, Home, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { StaticMapViewWithPOI} from './MapView.jsx';
import { Chat } from './Chat.jsx'
import { useNavigate } from 'react-router-dom';

export function CardEstates({ immobile, utenteLoggato }) {

  const navigate = useNavigate();
  // Build a safe full address: prefer street first, then city, and bias to Italy to reduce ambiguous matches
  const fullAddress = immobile?.indirizzo
    ? immobile?.citta
      ? `${immobile.indirizzo}, ${immobile.citta}, Italy`
      : `${immobile.indirizzo}, Italy`
    : immobile?.citta ?? null;
  // DEBUG: always log the immobile received by this component (helps debug search results)
  console.log('CardEstates received immobile ->', immobile);
  

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
            <span>{`${immobile.citta},${immobile.indirizzo}`}</span>
            {/* Visible debug: show the constructed fullAddress so user can see if city is present */}
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {`fullAddress: ${fullAddress ?? '(undefined)'}`}
            </div>
          </div>

          {/* Descrizione */}
          <p>
            {immobile.descrizione}
          </p>

          {/* Mappa piccola (debug: rendera' la mappa anche se mancano `coordinate` ma esiste un indirizzo) */}
          {(immobile.coordinate || immobile.citta || immobile.indirizzo) && (
            <div>
              {/* Debug: log the full address being passed */}
              {console.log('CardEstates: fullAddress ->', fullAddress, 'immobile.citta ->', immobile?.citta, 'hasCoordinate ->', !!immobile.coordinate)}
              <StaticMapViewWithPOI
                address={fullAddress}
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

