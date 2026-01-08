import { MapPin, Bus, Home, ChevronLeft, ChevronRight, Maximize, MessageCircle,
  Bath, ParkingCircle, Trees, Armchair, Warehouse, Snowflake, Zap, X, GraduationCap } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { StaticMapViewWithPOI } from './MapView.jsx';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export function CardEstates({ immobile, utenteLoggato }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [poiData, setPoiData] = useState(null);
  const cardRef = useRef(null);

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

  const getServiceIcon = (servizio) => {
    if (!servizio) return Home;

    const serviceLower = servizio.toLowerCase();

    if (serviceLower.includes('box') || serviceLower.includes('garage') ||
        serviceLower.includes('posto auto') || serviceLower.includes('parcheggio')) {
      return ParkingCircle;
    }

    if (serviceLower.includes('giardino') || serviceLower.includes('terrazzo') ||
        serviceLower.includes('balcone') || serviceLower.includes('veranda')) {
      return Trees;
    }

    if (serviceLower.includes('arredato') || serviceLower.includes('arredo')) {
      return Armchair;
    }

    if (serviceLower.includes('cantina') || serviceLower.includes('soffitta') ||
        serviceLower.includes('taverna') || serviceLower.includes('ripostiglio')) {
      return Warehouse;
    }

    if (serviceLower.includes('ascensore')) {
      return Zap;
    }

    if (serviceLower.includes('aria condizionata') || serviceLower.includes('climatizzat') ||
        serviceLower.includes('condizionatore')) {
      return Snowflake;
    }

    return Home;
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handlePoiData = useCallback((data) => {
    setPoiData(data);
  }, []);

  return (
      <>
        <div
            ref={cardRef}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={handleCardClick}
        >
          <div className="flex flex-col lg:flex-row">
            <div className="relative w-full lg:w-[40%] h-64 lg:h-80 bg-gray-200 flex-shrink-0">
              <img
                  src={allImages[currentImageIndex]}
                  alt={immobile.titolo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=Immagine+non+disponibile";
                  }}
              />

              {allImages.length > 1 && (
                  <>
                    <button
                        onClick={goPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow transition"
                    >
                      <ChevronLeft size={20} className="text-gray-800" />
                    </button>

                    <button
                        onClick={goNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow transition"
                    >
                      <ChevronRight size={20} className="text-gray-800" />
                    </button>

                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Home size={12} />
                      {currentImageIndex + 1}/{allImages.length}
                    </div>
                  </>
              )}
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between lg:w-[35%]">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatPrice(immobile.prezzo)}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                  {immobile.titolo}
                </h3>

                <div className="flex items-start gap-1.5 text-gray-600 mb-4 text-sm">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{immobile.citta}, {immobile.indirizzo}</span>
                </div>

                {immobile.descrizione && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {immobile.descrizione}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
                  {immobile.numeroStanze && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Home size={16} className="text-gray-500" />
                        <span>{immobile.numeroStanze} locali</span>
                      </div>
                  )}

                  {immobile.dimensione && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Maximize size={16} className="text-gray-500" />
                        <span>{immobile.dimensione} m²</span>
                      </div>
                  )}

                  {immobile.bagni && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Bath size={16} className="text-gray-500" />
                        <span>{immobile.bagni} {immobile.bagni === 1 ? 'bagno' : 'bagni'}</span>
                      </div>
                  )}
                </div>

                {immobile.servizi && immobile.servizi.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Servizi</div>
                      <div className="flex flex-wrap gap-2">
                        {immobile.servizi.map((servizio, idx) => {
                          const IconComponent = getServiceIcon(servizio);
                          return (
                              <div
                                  key={idx}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-700"
                              >
                                <IconComponent size={14} className="text-gray-600 flex-shrink-0" />
                                <span>{servizio}</span>
                              </div>
                          );
                        })}
                      </div>
                    </div>
                )}

                {poiData && (poiData.parks > 0 || poiData.schools > 0 || poiData.transport > 0) && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-xs text-green-700 uppercase tracking-wide mb-2 font-semibold">Nei dintorni</div>
                      <div className="flex flex-col gap-1">
                        {poiData.parks > 0 && (
                            <div className="flex items-center gap-2 text-sm text-green-800">
                              <Trees size={14} className="text-green-600" />
                              <span>Ci sono {poiData.parks} {poiData.parks === 1 ? 'parco' : 'parchi'}</span>
                            </div>
                        )}
                        {poiData.schools > 0 && (
                            <div className="flex items-center gap-2 text-sm text-green-800">
                              <GraduationCap size={14} className="text-green-600" />
                              <span>Ci sono {poiData.schools} {poiData.schools === 1 ? 'scuola' : 'scuole'}</span>
                            </div>
                        )}
                        {poiData.transport > 0 && (
                            <div className="flex items-center gap-2 text-sm text-green-800">
                              <Bus size={14} className="text-green-600" />
                              <span>Ci sono {poiData.transport} fermate di mezzi pubblici</span>
                            </div>
                        )}
                      </div>
                    </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Agente</span>
                  <span className="text-sm font-semibold text-gray-900">{immobile.agenteImmobiliare}</span>
                </div>
              </div>
            </div>

            {(immobile.coordinate || immobile.citta || immobile.indirizzo) && (
                <div className="w-full lg:w-[30%] lg:max-w-[30%] border-t lg:border-t-0 lg:border-l border-gray-200 flex-shrink-0 lg:h-80">
                  <div className="w-full h-64 lg:h-full bg-gray-100 overflow-hidden">
                    <StaticMapViewWithPOI address={fullAddress} center={true} onPoiData={handlePoiData} />
                  </div>
                </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/Chat', {
                    state: {
                      immobile: immobile.id, // l'intero oggetto
                      agenteImmobiliare: immobile.agenteImmobiliare,
                      utenteLoggato
                    }
                  });
                }}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              MESSAGGIO
            </button>
          </div>
        </div>

        {showModal && (
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto pt-8"
                onClick={() => setShowModal(false)}
            >
              <div
                  className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 relative"
                  onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                      onClick={() => setShowModal(false)}
                      className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                  >
                    <X size={24} className="text-gray-800" />
                  </button>

                  <div className="relative w-full h-96 bg-gray-200">
                    <img
                        src={allImages[currentImageIndex]}
                        alt={immobile.titolo}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setShowFullImage(true)}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/800x600?text=Immagine+non+disponibile";
                        }}
                    />

                    {allImages.length > 1 && (
                        <>
                          <button
                              onClick={goPrev}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition z-10"
                          >
                            <ChevronLeft size={24} className="text-gray-800" />
                          </button>

                          <button
                              onClick={goNext}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition z-10"
                          >
                            <ChevronRight size={24} className="text-gray-800" />
                          </button>

                          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full pointer-events-none">
                            {currentImageIndex + 1} / {allImages.length}
                          </div>
                        </>
                    )}
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="text-4xl font-bold text-gray-900 mb-3">
                      {formatPrice(immobile.prezzo)}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      {immobile.titolo}
                    </h2>

                    <div className="flex items-start gap-2 text-gray-600 mb-6">
                      <MapPin size={20} className="mt-0.5 flex-shrink-0" />
                      <span className="text-lg">{immobile.citta}, {immobile.indirizzo}</span>
                    </div>

                    {immobile.descrizione && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Descrizione</h3>
                          <p className="text-gray-700 leading-relaxed">
                            {immobile.descrizione}
                          </p>
                        </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Caratteristiche</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {immobile.numeroStanze && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Home size={20} className="text-blue-600" />
                              <div>
                                <div className="text-sm text-gray-500">Locali</div>
                                <div className="font-semibold text-gray-900">{immobile.numeroStanze}</div>
                              </div>
                            </div>
                        )}

                        {immobile.dimensione && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Maximize size={20} className="text-blue-600" />
                              <div>
                                <div className="text-sm text-gray-500">Superficie</div>
                                <div className="font-semibold text-gray-900">{immobile.dimensione} m²</div>
                              </div>
                            </div>
                        )}

                        {immobile.bagni && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Bath size={20} className="text-blue-600" />
                              <div>
                                <div className="text-sm text-gray-500">Bagni</div>
                                <div className="font-semibold text-gray-900">{immobile.bagni}</div>
                              </div>
                            </div>
                        )}
                      </div>
                    </div>

                    {immobile.servizi && immobile.servizi.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Servizi</h3>
                          <div className="flex flex-wrap gap-2">
                            {immobile.servizi.map((servizio, idx) => {
                              const IconComponent = getServiceIcon(servizio);
                              return (
                                  <div
                                      key={idx}
                                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-800"
                                  >
                                    <IconComponent size={16} className="text-blue-600 flex-shrink-0" />
                                    <span>{servizio}</span>
                                  </div>
                              );
                            })}
                          </div>
                        </div>
                    )}

                    {poiData && (poiData.parks > 0 || poiData.schools > 0 || poiData.transport > 0) && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Servizi nei dintorni</h3>
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex flex-col gap-2">
                              {poiData.parks > 0 && (
                                  <div className="flex items-center gap-3 text-green-800">
                                    <Trees size={18} className="text-green-600" />
                                    <span className="text-base">Ci sono {poiData.parks} {poiData.parks === 1 ? 'parco' : 'parchi'} nelle vicinanze</span>
                                  </div>
                              )}
                              {poiData.schools > 0 && (
                                  <div className="flex items-center gap-3 text-green-800">
                                    <GraduationCap size={18} className="text-green-600" />
                                    <span className="text-base">Ci sono {poiData.schools} {poiData.schools === 1 ? 'scuola' : 'scuole'} nelle vicinanze</span>
                                  </div>
                              )}
                              {poiData.transport > 0 && (
                                  <div className="flex items-center gap-3 text-green-800">
                                    <Bus size={18} className="text-green-600" />
                                    <span>Ci sono {poiData.transport} fermate di mezzi pubblici nelle vicinanze</span>
                                  </div>
                              )}
                            </div>
                          </div>
                        </div>
                    )}

                    {(immobile.coordinate || immobile.citta || immobile.indirizzo) && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Posizione</h3>
                          <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
                            <StaticMapViewWithPOI address={fullAddress} center={true} onPoiData={handlePoiData} />
                          </div>
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-200">
                      <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">Agente</div>
                      <div className="text-lg font-semibold text-gray-900">{immobile.agenteImmobiliare}</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <button
                      onClick={async (e) => {
                        e.stopPropagation();

                        try {
                          const token = localStorage.getItem("token"); // prendi il JWT salvato
                          const immobileId = immobile.id;             // solo l'ID, non l'oggetto intero

                          const chatResponse = await axios.get(`${import.meta.env.VITE_API_URL}/chat/openChat`, {
                            params: {
                              otherUser: immobile.agenteImmobiliare,  // corrisponde al @RequestParam "otherUser"
                              immobile: immobileId                   // corrisponde al @RequestParam "immobile"
                            },
                            headers: { Authorization: `Bearer ${token}` }
                          });

                          const chatData = chatResponse.data;

                          // naviga alla pagina chat con lo stato necessario
                          navigate('/Chat', {
                            state: {
                              chat: chatData,
                              utenteLoggato,
                              immobileId
                            }
                          });

                        } catch (err) {
                          console.error("Errore caricamento chat:", err);
                          alert("Errore durante l'apertura della chat. Controlla la console.");
                        }
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    MESSAGGIO
                  </button>
                </div>
              </div>
            </div>
        )}

        {showFullImage && (
            <div
                className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
                onClick={() => setShowFullImage(false)}
            >
              <button
                  onClick={() => setShowFullImage(false)}
                  className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
              >
                <X size={24} className="text-gray-800" />
              </button>

              <img
                  src={allImages[currentImageIndex]}
                  alt={immobile.titolo}
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/1920x1080?text=Immagine+non+disponibile";
                  }}
              />

              {allImages.length > 1 && (
                  <>
                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goPrev(e);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition"
                    >
                      <ChevronLeft size={32} className="text-gray-800" />
                    </button>

                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goNext(e);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition"
                    >
                      <ChevronRight size={32} className="text-gray-800" />
                    </button>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 text-white text-lg px-4 py-2 rounded-full">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </>
              )}
            </div>
        )}
      </>
  );
}