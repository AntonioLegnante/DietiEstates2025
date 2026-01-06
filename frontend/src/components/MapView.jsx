import React, { useState, useEffect } from 'react';

const GEOAPIFY_API_KEY = "adc2508ae55d4cde87008f39f29ccbe7";
const POI_CATEGORIES = "leisure.park,education.school";
const SEARCH_RADIUS_M = 1500;

export function StaticMapViewWithPOI({ address, center = false, onPoiData }) {
    const [coords, setCoords] = useState(null);
    const [poiMarkers, setPoiMarkers] = useState('');
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

            const roundedLon = lon.toFixed(6);
            const roundedLat = lat.toFixed(6);
            const filterValue = `circle:${roundedLon},${roundedLat},${SEARCH_RADIUS_M}`;

            const params = new URLSearchParams({
                categories: POI_CATEGORIES,
                filter: filterValue,
                limit: 10,
                apiKey: GEOAPIFY_API_KEY
            });

            const placesUrl = `https://api.geoapify.com/v2/places?${params.toString()}`;

            try {
                const poiResponse = await fetch(placesUrl);

                if (!poiResponse.ok) {
                    const errorText = await poiResponse.text();
                    console.error("Dettagli Errore Geoapify 400/403:", errorText);
                    throw new Error(`Errore Places API HTTP: ${poiResponse.status}`);
                }

                const poiData = await poiResponse.json();

                if (poiData.features && poiData.features.length > 0) {
                    // Conta i POI per categoria
                    const poiCounts = {
                        parks: 0,
                        schools: 0
                    };

                    const poiMarkerString = poiData.features
                        .map(feature => {
                            const [poiLon, poiLat] = feature.geometry.coordinates;
                            const categories = feature.properties.categories || [];

                            let color, icon;
                            if (categories.includes('leisure.park')) {
                                color = 'green';
                                icon = 'tree';
                                poiCounts.parks++;
                            } else if (categories.includes('education.school')) {
                                color = 'blue';
                                icon = 'graduation-cap';
                                poiCounts.schools++;
                            } else {
                                color = 'orange';
                                icon = 'map-marker';
                            }

                            return `lonlat:${poiLon},${poiLat};type:awesome;color:${color};icon:${icon}`;
                        })
                        .slice(0, 10)
                        .join('|');

                    setPoiMarkers(poiMarkerString);

                    // Invia i dati POI al componente padre
                    if (onPoiData) {
                        onPoiData(poiCounts);
                    }
                } else {
                    // Nessun POI trovato
                    if (onPoiData) {
                        onPoiData({ parks: 0, schools: 0 });
                    }
                }
            } catch (err) {
                console.error("Errore Places API:", err);
                if (onPoiData) {
                    onPoiData({ parks: 0, schools: 0 });
                }
            } finally {
                setLoading(false);
            }
        };

        geocodeAndFetchPoi();
    }, [address, onPoiData]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
                Caricamento mappa...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-red-500 text-sm p-4 text-center">
                {error}
            </div>
        );
    }

    if (!coords) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
                Indirizzo non disponibile
            </div>
        );
    }

    const mainMarker = `lonlat:${coords.lon},${coords.lat};type:awesome;color:red;icon:home`;
    const allMarkers = [mainMarker, poiMarkers].filter(Boolean).join('|');
    const zoomLevel = center ? 15 : 13;

    const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&center=lonlat:${coords.lon},${coords.lat}&zoom=${zoomLevel}&marker=${allMarkers}&width=600&height=400&apiKey=${GEOAPIFY_API_KEY}`;

    return (
        <div className="w-full h-full relative">
            <img
                src={mapUrl}
                alt={`Mappa per ${address}`}
                className="w-full h-full object-cover"
            />
        </div>
    );
}