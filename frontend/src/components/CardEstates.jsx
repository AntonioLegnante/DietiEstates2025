import { MapPin, Home, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { StaticMapViewWithPOI } from './MapView.jsx';
import { useNavigate } from 'react-router-dom';

export function CardEstates({ immobile, utenteLoggato }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef(null);

  // 🆕 Modal enlarged card
  const [showModal, setShowModal] = useState(false);

  const allImages = [
    immobile.linkImmagine,
    ...(immobile.galleryImages || [])
  ].filter(Boolean);

  const fullAddress = immobile?.indirizzo
      ? immobile?.citta
          ? `${immobile.indirizzo}, ${immobile.citta}, Italy`
          : `${immobile.indirizzo}, Italy`
      : immobile?.citta ?? null;

  const formatPrice = (price) =>
      new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);

  const goPrev = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const goTo = (e, i) => {
    e.stopPropagation();
    setCurrentImageIndex(i);
  };

  // 🔹 Focus sulla card quando viene cliccata
  const handleCardClick = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  return (
      <>
        {/* CARD PRINCIPALE */}
        <div
            ref={cardRef}
            className="bg-white w-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={handleCardClick}
        >

          {/* TOP SECTION responsive */}
          <div className="flex flex-col md:flex-row w-full">

            {/* 🟩 CAROUSEL — IMMAGINI GRANDI */}
            <div className="relative w-full md:w-2/3 h-96 bg-gray-200">
              <img
                  src={allImages[currentImageIndex]}
                  alt={`${immobile.titolo} - Foto`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=Immagine+non+disponibile";
                  }}
              />

              {/* PRICE BADGE */}
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-md font-bold text-lg shadow-lg">
                {formatPrice(immobile.prezzo)}
              </div>

              {/* CONTROLLI CAROUSEL */}
              {allImages.length > 1 && (
                  <>
                    <button
                        onClick={goPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-transform hover:scale-110"
                    >
                      <ChevronLeft size={24} className="text-gray-800" />
                    </button>

                    <button
                        onClick={goNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-transform hover:scale-110"
                    >
                      <ChevronRight size={24} className="text-gray-800" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {allImages.map((_, i) => (
                          <button
                              key={i}
                              onClick={(e) => goTo(e, i)}
                              className={`h-2 rounded-full transition-all ${
                                  i === currentImageIndex
                                      ? "w-6 bg-white"
                                      : "w-2 bg-white/50 hover:bg-white"
                              }`}
                          />
                      ))}
                    </div>

                    <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </>
              )}
            </div>

            {/* MAPPA RIDOTTA */}
            {(immobile.coordinate || immobile.citta || immobile.indirizzo) && (
                <div className="w-full md:w-1/3 h-64 md:h-96 border-t md:border-t-0 md:border-l border-gray-300 overflow-hidden">
                  <StaticMapViewWithPOI address={fullAddress} center={true} />
                </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{immobile.titolo}</h3>

            <div className="flex items-center gap-2 text-gray-600 mb-3 text-sm">
              <MapPin size={16} />
              <span>{immobile.citta}, {immobile.indirizzo}</span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{immobile.descrizione}</p>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <Home size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">ID: {immobile.id}</span>
            </div>
          </div>

          {/* FOOTER */}
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
                      utenteLoggato
                    }
                  });
                }}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors active:scale-95"
            >
              Messaggia
            </button>
          </div>
        </div>

        {/* 🟥 MODAL FULLSCREEN (CARD GRANDE) */}
        {showModal && (
            <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setShowModal(false)}
            >
              <div
                  className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-xl overflow-y-auto relative animate-[fadeIn_0.25s]"
                  onClick={(e) => e.stopPropagation()}
              >
                {/* CLOSE BUTTON */}
                <button
                    onClick={() => setShowModal(false)}
                    className="sticky top-4 left-full ml-4 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
                >
                  <X size={20} />
                </button>

                {/* IMMAGINE GRANDE */}
                <div className="w-full h-[500px] bg-black">
                  <img
                      src={allImages[currentImageIndex]}
                      alt={`${immobile.titolo} - Dettaglio`}
                      className="w-full h-full object-contain"
                  />
                </div>

                {/* MAPPA GRANDE */}
                {(immobile.coordinate || immobile.citta || immobile.indirizzo) && (
                    <div className="w-full h-[400px] border-t border-gray-300">
                      <StaticMapViewWithPOI address={fullAddress} center={true} />
                    </div>
                )}

                {/* INFO */}
                <div className="p-6">
                  <h2 className="text-3xl font-bold mb-3">{immobile.titolo}</h2>
                  <p className="text-gray-700 mb-4">{immobile.descrizione}</p>
                  <p className="text-gray-600">📍 {immobile.citta}, {immobile.indirizzo}</p>
                </div>

                <div className="p-6 border-t">
                  <button
                      onClick={() => setShowModal(false)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Torna alla ricerca
                  </button>
                </div>

              </div>
            </div>
        )}
      </>
  );
}
