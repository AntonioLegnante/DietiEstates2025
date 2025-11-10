import React, { useState, useEffect } from 'react';

// Sostituisci con la tua chiave API di Geoapify
const GEOAPIFY_API_KEY = "adc2508ae55d4cde87008f39f29ccbe7";

// ⭐ CORREZIONE CHIAVE: Uso delle categorie gerarchiche supportate dall'API Geoapify
const POI_CATEGORIES = "leisure.park,education.school"; 
// Raggio di ricerca intorno al punto centrale (in metri)
const SEARCH_RADIUS_M = 1500; 

export function StaticMapViewWithPOI({ address }) {
    const [coords, setCoords] = useState(null); // { lat: number, lon: number }
    const [poiMarkers, setPoiMarkers] = useState(''); // Stringa per i marcatori POI nell'URL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!address) {
            setLoading(false);
            return;
        }

        const geocodeAndFetchPoi = async () => {
            setLoading(true);
            setError(null);
            setCoords(null);
            setPoiMarkers('');

            let lat, lon;

            // --- 1. Geocoding: Indirizzo -> Coordinate ---
            const encodedAddress = encodeURIComponent(address);
            const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&apiKey=${GEOAPIFY_API_KEY}`;
            
            try {
                const response = await fetch(geocodeUrl);
                if (!response.ok) throw new Error(`Errore Geocoding HTTP: ${response.status}`);
                
                const data = await response.json();

                if (data.features && data.features.length > 0) {
                    [lon, lat] = data.features[0].geometry.coordinates;
                    setCoords({ lat, lon });
                } else {
                    setError("Indirizzo non trovato.");
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error("Errore Geocoding:", err);
                setError("Errore durante la ricerca delle coordinate.");
                setLoading(false);
                return;
            }

            // --- 2. Places API: Coordinate -> POI (Punti di Interesse) ---
            
            const roundedLon = lon.toFixed(6);
            const roundedLat = lat.toFixed(6);

            const filterValue = `circle:${roundedLon},${roundedLat},${SEARCH_RADIUS_M}`;

            const params = new URLSearchParams({
                categories: POI_CATEGORIES, // Usa le nuove categorie supportate
                filter: filterValue,
                limit: 10,
                apiKey: GEOAPIFY_API_KEY
            });
            
            const placesUrl = `https://api.geoapify.com/v2/places?${params.toString()}`;
            
            try {
                const poiResponse = await fetch(placesUrl);
                
                if (!poiResponse.ok) {
                    // Manteniamo il debug nel caso ci siano altri problemi 400
                    const errorText = await poiResponse.text();
                    console.error("Dettagli Errore Geoapify 400/403:", errorText);
                    throw new Error(`Errore Places API HTTP: ${poiResponse.status}`);
                }
                
                const poiData = await poiResponse.json();
                
                if (poiData.features && poiData.features.length > 0) {
                    
                    const poiMarkerString = poiData.features
                        .map(feature => {
                            const [poiLon, poiLat] = feature.geometry.coordinates;
                            const categories = feature.properties.categories || [];
                            
                            let color, icon;
                            // ⭐ LOGICA AGGIORNATA per le nuove categorie gerarchiche
                            if (categories.includes('leisure.park')) { 
                                color = 'green';
                                icon = 'tree';
                            } else if (categories.includes('education.school')) { 
                                color = 'blue';
                                icon = 'graduation-cap';
                            } else {
                                color = 'orange';
                                icon = 'map-marker';
                            }

                            return `lonlat:${poiLon},${poiLat};type:awesome;color:${color};icon:${icon}`;
                        })
                        .slice(0, 10) 
                        .join('|'); 
                    
                    setPoiMarkers(poiMarkerString);
                }
            } catch (err) {
                console.error("Errore Places API:", err);
            } finally {
                setLoading(false);
            }
        };

        geocodeAndFetchPoi();
    }, [address]); 

    // --- Rendering ---
    
    if (loading) return <p>Caricamento mappa e servizi pubblici per: **{address}** (raggio di **{SEARCH_RADIUS_M}m**)...</p>;
    if (error) return <p style={{color: 'red'}}>Errore: {error}</p>;
    if (!coords) return <p>Inserisci un indirizzo valido per visualizzare la mappa.</p>;

    const mainMarker = `lonlat:${coords.lon},${coords.lat};type:awesome;color:red;icon:home`;
    const allMarkers = [mainMarker, poiMarkers].filter(Boolean).join('|');

    const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&center=lonlat:${coords.lon},${coords.lat}&zoom=13&marker=${allMarkers}&width=800&height=500&apiKey=${GEOAPIFY_API_KEY}`;

    return (
        <div style={{ width: '800px', height: '550px' }}>
            <h3>Mappa per: {address}</h3>
            <p>Servizi (Parchi e Scuole) ricercati nel raggio di **{SEARCH_RADIUS_M}m**.</p>
            <img 
                src={mapUrl} 
                alt={`Mappa per ${address} con POI`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {poiMarkers.length > 0 ? (
                <p>Marcatori POI trovati: Parchi: Albero Verde 🌳, Scuole: Cappello Blu 🎓.</p>
            ) : (
                <p>Nessun parco o scuola trovato nel raggio di **{SEARCH_RADIUS_M}m**.</p>
            )}
         
        </div>
    );
}