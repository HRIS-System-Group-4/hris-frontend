"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Map, { MapRef } from 'react-map-gl/mapbox';
import type { ViewState } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface IProps { }

export default function MapComponent({ }: IProps) {
    const mapRef = useRef<MapRef | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    useEffect(() => {
        // This will run if the map loads before the useEffect
        if (mapRef.current) {
            const map = mapRef.current.getMap();
            if (map.loaded()) {
                addMarkers();
            }
        }
    }, []);

    // Cleanup markers on unmount
    useEffect(() => {
        return () => {
            markersRef.current.forEach(marker => marker.remove());
        };
    }, []);

    const handleMarkerClick = (longitude: number, latitude: number, zoomLevel: number = 20) => {
        setViewState(prev => ({
            ...prev,
            longitude,
            latitude,
            zoom: zoomLevel,
        }));

        // Alternative: Use map.flyTo for smooth animation
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [longitude, latitude],
                zoom: zoomLevel,
                duration: 1000
            });
        }
    };

    const [viewState, setViewState] = useState<ViewState>({
        latitude: -7.95461547,
        longitude: 112.63222576,
        zoom: 14,
        bearing: 0,
        pitch: 0,
        padding: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    // Add markers when map is loaded
    const addMarkers = () => {
        if (mapRef.current) {
            const map = mapRef.current.getMap();

            // Clear existing markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            // Create new marker with your specified styling
            const marker = new mapboxgl.Marker({
                color: '#3b82f6',
                scale: 1.2 // Make it slightly larger
            })
                .setLngLat([112.63222576, -7.95461547])
                .addTo(map);

            // Add click event to marker
            marker.getElement().addEventListener('click', () => {
                handleMarkerClick(112.63222576, -7.95461547, 18);
            });

            // Store marker reference
            markersRef.current.push(marker);
        }
    };

    return (
        <div className="text-black relative">
            <Map
                {...viewState}
                style={{ width: '100%', height: 'calc(50vh - 64px)' }}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                onMove={(evt) => setViewState(evt.viewState)}
                onLoad={addMarkers} // Add markers when map loads
                ref={mapRef}
                minZoom={5}
                maxZoom={15}
                mapStyle="mapbox://styles/mapbox/streets-v12"
            >
                {/* No more react-map-gl Marker components needed */}
            </Map>
        </div>
    );
}