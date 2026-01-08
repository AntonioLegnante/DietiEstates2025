import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const GEOAPIFY_API_KEY = "adc2508ae55d4cde87008f39f29ccbe7";
// Corretto: 'public_transport' invece di 'transport.public_transport'
const POI_CATEGORIES = "leisure.park,education.school,public_transport";
const SEARCH_RADIUS_M = 500;

// Configurazione Icone Colorate
const createIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const icons = {
    main: createIcon('blue'),      // Immobile
    park: createIcon('green'),     // Parchi
    school: createIcon('gold'),    // Scuole
    transport: createIcon('violet') // Trasporti
};

function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export function StaticMapViewWithPOI({ address, center = false, onPoiData }) {
    const [coords, setCoords] = useState(null);
    const [poiMarkers, setPoiMarkers] = useState([]);

    useEffect(() => {
        if (!address) return;

        const fetchData = async () => {
            try {
                // 1. Geocoding
                const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_API_KEY}`;
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();

                if (geoData.features?.length > 0) {
                    const [lon, lat] = geoData.features[0].geometry.coordinates;
                    setCoords({ lat, lon });

                    // 2. POI Search - Costruzione URL corretta
                    const params = new URLSearchParams({
                        categories: POI_CATEGORIES,
                        limit: '50',
                        apiKey: GEOAPIFY_API_KEY
                    });

                    // Usiamo public_transport come categoria supportata
                    const poiUrl = `https://api.geoapify.com/v2/places?${params.toString()}&filter=circle:${lon},${lat},${SEARCH_RADIUS_M}`;

                    const poiRes = await fetch(poiUrl);

                    if (!poiRes.ok) {
                        const errText = await poiRes.text();
                        console.error("Dettaglio Errore Geoapify:", errText);
                        throw new Error(`Errore API: ${poiRes.status}`);
                    }

                    const poiData = await poiRes.json();
                    const counts = { parks: 0, schools: 0, transport: 0 };

                    const markers = poiData.features?.map(f => {
                        const cats = f.properties.categories || [];
                        let type = 'main';

                        // Logica di assegnazione tipo e conteggio basata sulle nuove categorie
                        if (cats.some(c => c.includes('park'))) {
                            counts.parks++;
                            type = 'park';
                        }
                        else if (cats.some(c => c.includes('school'))) {
                            counts.schools++;
                            type = 'school';
                        }
                        else if (cats.some(c => c.includes('public_transport'))) {
                            counts.transport++;
                            type = 'transport';
                        }

                        return {
                            lat: f.geometry.coordinates[1],
                            lon: f.geometry.coordinates[0],
                            name: f.properties.name || "Servizio di zona",
                            type
                        };
                    }) || [];

                    setPoiMarkers(markers);
                    onPoiData?.(counts);
                }
            } catch (err) {
                console.error("Errore Geocoding/POI:", err);
            }
        };

        fetchData();
    }, [address]);

    if (!coords) return (
        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
            Caricamento mappa...
        </div>
    );

    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={[coords.lat, coords.lon]}
                zoom={center ? 15 : 13}
                className="w-full h-full"
                style={{ zIndex: 0 }}
            >
                <ChangeView center={[coords.lat, coords.lon]} zoom={center ? 15 : 13} />
                <TileLayer
                    url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`}
                    attribution='© Geoapify'
                />

                {/* Marker Immobile Principale */}
                <Marker position={[coords.lat, coords.lon]} icon={icons.main}>
                    <Popup><p className="font-bold">{address}</p></Popup>
                </Marker>

                {/* Marker POI Colorati (Parchi, Scuole, Trasporti) */}
                {poiMarkers.map((p, i) => (
                    <Marker key={i} position={[p.lat, p.lon]} icon={icons[p.type] || icons.main}>
                        <Popup>
                            <span className="font-medium">{p.name}</span>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}