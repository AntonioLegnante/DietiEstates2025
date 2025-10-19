import { MapPin, Home } from 'lucide-react';

export function ModalDetail({ immobile }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <img
            src={immobile.linkImmagine}
            alt={immobile.titolo}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x400?text=Immagine+non+disponibile';
            }}
          />
          <button
            onClick={onClose}
          >
            ✕
          </button>
          <div>
            {formatPrice(immobile.prezzo)}
          </div>
        </div>

        <div>
          <h2>{immobile.titolo}</h2>
          
          <div>
            <MapPin />
            <span>{immobile.indirizzo}</span>
          </div>

          <div>
            <h3>Descrizione</h3>
            <p>{immobile.descrizione}</p>
          </div>

          <div>
            <Home />
            <span>ID Immobile: {immobile.id}</span>
          </div>

          {immobile.coordinate && (
            <div>
              <h3>Posizione</h3>
              <MapView 
                lat={immobile.coordinate.lat} 
                lng={immobile.coordinate.lng} 
                address={immobile.indirizzo}
              />
            </div>
          )}

          <button
            onClick={onClose}
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}