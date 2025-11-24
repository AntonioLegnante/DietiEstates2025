import { MapPin, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { StaticMapViewWithPOI} from './MapView.jsx';
import { useNavigate } from 'react-router-dom';

export function CardEstates({ immobile, utenteLoggato }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = [
    immobile.linkImmagine,
    ...(immobile.galleryImages || [])
  ].filter(Boolean);

  const fullAddress = immobile?.indirizzo
      ? immobile?.citta
          ? `${immobile.indirizzo}, ${immobile.citta}, Italy`
          : `${immobile.indirizzo}, Italy`
      : immobile?.citta ?? null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const goToPrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
        prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
        prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 max-w-md">
        {/* Carousel */}
        <div className="relative w-full h-72 bg-gray-100">
          <img
              src={allImages[currentImageIndex]}
              alt={`${immobile.titolo} - Foto ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Immagine+non+disponibile';
              }}
          />

          {/* Price Badge */}
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg z-10">
            {formatPrice(immobile.prezzo)}
          </div>

          {/* Navigation Buttons */}
          {allImages.length > 1 && (
              <>
                <button
                    onClick={goToPrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110 z-10"
                    aria-label="Immagine precedente"
                >
                  <ChevronLeft size={24} className="text-gray-800" />
                </button>

                <button
                    onClick={goToNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110 z-10"
                    aria-label="Immagine successiva"
                >
                  <ChevronRight size={24} className="text-gray-800" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {allImages.map((_, index) => (
                      <button
                          key={index}
                          onClick={(e) => goToImage(index, e)}
                          className={`h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                  ? 'w-6 bg-white'
                                  : 'w-2 bg-white/50 hover:bg-white/80'
                          }`}
                          aria-label={`Vai all'immagine ${index + 1}`}
                      />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {immobile.titolo}
          </h3>

          <div className="flex items-center gap-2 text-gray-600 mb-3 text-sm">
            <MapPin size={16} />
            <span>{`${immobile.citta}, ${immobile.indirizzo}`}</span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {immobile.descrizione}
          </p>

          {(immobile.coordinate || immobile.citta || immobile.indirizzo) && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <StaticMapViewWithPOI address={fullAddress} />
              </div>
          )}

          <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
            <Home size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">ID: {immobile.id}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Agente</span>
            <span className="text-sm font-semibold text-gray-900">{immobile.agenteImmobiliare}</span>
          </div>

          <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/Chat', {
                  state: {
                    immobile: immobile.id,
                    agenteImmobiliare: immobile.agenteImmobiliare,
                    utenteLoggato: utenteLoggato
                  }
                });
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors active:scale-95"
          >
            Messaggia
          </button>
        </div>
      </div>
  );
}