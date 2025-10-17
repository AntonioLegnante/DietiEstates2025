import { MapPin, Home  } from 'lucide-react';
// Componente Card Immobile
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
    <div>
      {/* Immagine */}
      <div>
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
      </div>

      {/* Contenuto */}
      <div>
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

        {/* Info aggiuntive */}
        <div>
          <div>
            <Home />
            <span>ID: {immobile.id}</span>
          </div>
        </div>        
      </div>
    </div>
  );
}