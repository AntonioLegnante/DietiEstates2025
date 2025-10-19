import { MapPin, Home, ExternalLink } from 'lucide-react';
import { useState } from 'react';

function MapView({ lat, lng }) {
  return (
    <div>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`}
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visualizza mappa più grande
      </a>
    </div>
  );
}

export function CardEstates({ immobile }) {

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
      </div>
    </>
  );
}

