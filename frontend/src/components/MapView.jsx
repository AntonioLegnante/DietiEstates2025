import React, { useState, useEffect } from 'react';

// Sostituisci con la tua chiave API di Geoapify
const GEOAPIFY_API_KEY = "adc2508ae55d4cde87008f39f29ccbe7";

export function StaticMapView({ address }) {
    const [coords, setCoords] = useState(null); // { lat: number, lon: number }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Debug: log the received address prop so we can see whether city is present
    console.log('StaticMapView received address ->', address);

    useEffect(() => {
        if (!address) return;

        const geocodeAddress = async () => {
            setLoading(true);
            setError(null);

            // Codifica l'indirizzo per l'URL (es: "Via Roma 10" -> "Via%20Roma%2010")
            const encodedAddress = encodeURIComponent(address);
            const url = `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&apiKey=${GEOAPIFY_API_KEY}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Errore HTTP: ${response.status}`);
                }
                const data = await response.json();

                if (data.features && data.features.length > 0) {
                    const [lon, lat] = data.features[0].geometry.coordinates;
                    setCoords({ lat, lon });
                } else {
                    setError("Indirizzo non trovato.");
                    setCoords(null);
                }
            } catch (err) {
                console.error("Errore Geocoding:", err);
                setError("Errore durante la ricerca delle coordinate.");
            } finally {
                setLoading(false);
            }
        };

        geocodeAddress();
    }, [address]); // Riesegui ogni volta che l'indirizzo cambia

    // --- Rendering ---

    if (loading) {
        return <p>Caricamento mappa... {address ? `(address: ${address})` : ''}</p>;
    }

    if (error) {
        return <p style={{color: 'red'}}>Errore: {error} {address ? `(address: ${address})` : ''}</p>;
    }

    if (!coords) {
        return <p>Inserisci un indirizzo valido per visualizzare la mappa.</p>
    }

    // Se abbiamo le coordinate, generiamo l'URL della Mappa Statica Geoapify
    const mapUrl = `https://maps.geoapify.com/v1/staticmap?
    style=osm-carto&
    center=lonlat:${coords.lon},${coords.lat}&
    zoom=14&
    marker=lonlat:${coords.lon},${coords.lat};type:awesome;color:red;icon:home&
    width=600&
    height=400&
    apiKey=${GEOAPIFY_API_KEY}`.replace(/\s/g, ''); // Rimuove gli spazi e a capo per URL

    return (
        <div style={{ width: '600px', height: '400px' }}>
            <h3>Mappa per: {address}</h3>
            <img
                src={mapUrl}
                alt={`Mappa per ${address}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <a
                href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=15/${coords.lat}/${coords.lon}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Apri su OpenStreetMap
            </a>
        </div>
    );
}