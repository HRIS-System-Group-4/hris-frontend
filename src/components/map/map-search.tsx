'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { CommandList } from 'cmdk';
import { MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { IconX } from '@tabler/icons-react';

interface SearchResult {
    id: string;
    name: string;
    mapbox_id: string;
    coordinates?: [number, number];
    place_type: string;
    full_address: string;
    category?: string;
}

interface IProps {
    onLocationSelect?: (latitude?: number, longitude?: number) => void;
    locationSelected?: [latitude?: number, longitude?: number];
}

export default function MapSearchComponent({ onLocationSelect, locationSelected }: IProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [sessionToken, setSessionToken] = useState(uuidv4());
    const [coordinates, setCoordinates] = useState<string[] | null>(
        locationSelected && locationSelected[0] !== undefined && locationSelected[1] !== undefined
            ? [`Longitude: ${locationSelected[1].toFixed(6)}`, `Latitude: ${locationSelected[0].toFixed(6)}`]
            : null
    );

    // Initialize map and marker
    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [112.63222576, -7.95461547], // Malang default
            zoom: 10,
            minZoom: 5,
            maxZoom: 18,
        });

        // Initialize marker if locationSelected is provided
        if (locationSelected && locationSelected[0] !== undefined && locationSelected[1] !== undefined) {
            const [latitude, longitude] = locationSelected;
            markerRef.current = new mapboxgl.Marker({ color: '#3b82f6' })
                .setLngLat([longitude, latitude])
                .addTo(mapRef.current!);
            mapRef.current.flyTo({
                center: [longitude, latitude],
                zoom: 14,
                duration: 1000,
            });
            setCoordinates([`Longitude: ${longitude.toFixed(6)}`, `Latitude: ${latitude.toFixed(6)}`]);
        }

        // Handle map click to place marker
        mapRef.current.on('click', (e) => {
            const { lng, lat } = e.lngLat;

            // Update or create marker
            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new mapboxgl.Marker({ color: '#3b82f6' })
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current!);
            }

            // Update coordinates and form fields
            setCoordinates([`Longitude: ${lng.toFixed(6)}`, `Latitude: ${lat.toFixed(6)}`]);
            if (onLocationSelect) {
                onLocationSelect(lat, lng);
            }

            // Clear selected POI if clicking manually
            setSelectedLocation(null);
            setSearchQuery('');
            setShowResults(false);
        });

        // Handle remove button click
        const handleRemoveClick = () => {
            if (markerRef.current) {
                markerRef.current.remove();
                markerRef.current = null;
                setCoordinates(null);
                setSelectedLocation(null);
                setSearchQuery('');
                if (onLocationSelect) {
                    onLocationSelect(undefined, undefined);
                }
            }
        };

        mapRef.current.getContainer().addEventListener('click', (e) => {
            if ((e.target as HTMLElement).id === 'remove-marker') {
                handleRemoveClick();
            }
        });

        return () => {
            mapRef.current?.remove();
        };
    }, [onLocationSelect]);

    // Sync marker with locationSelected changes
    useEffect(() => {
        if (!mapRef.current) return;

        if (locationSelected && locationSelected[0] !== undefined && locationSelected[1] !== undefined) {
            const [latitude, longitude] = locationSelected;
            if (markerRef.current) {
                markerRef.current.setLngLat([longitude, latitude]);
            } else {
                markerRef.current = new mapboxgl.Marker({ color: '#3b82f6' })
                    .setLngLat([longitude, latitude])
                    .addTo(mapRef.current!);
            }
            mapRef.current.flyTo({
                center: [longitude, latitude],
                zoom: 14,
                duration: 1000,
            });
            setCoordinates([`Longitude: ${longitude.toFixed(6)}`, `Latitude: ${latitude.toFixed(6)}`]);
        } else {
            if (markerRef.current) {
                markerRef.current.remove();
                markerRef.current = null;
                setCoordinates(null);
            }
        }
    }, [locationSelected]);

    // Search function using /suggest
    const searchLocations = useCallback(
        async (query: string) => {
            if (!query.trim() || query.length < 3) {
                setSearchResults([]);
                setShowResults(false);
                return;
            }

            setIsLoading(true);
            try {
                const center = mapRef.current
                    ? mapRef.current.getCenter().toArray()
                    : [112.63222576, -7.95461547];

                const response = await fetch(
                    `https://api.mapbox.com/search/searchbox/v1/suggest?` +
                    `q=${encodeURIComponent(query)}&` +
                    `access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&` +
                    `session_token=${encodeURIComponent(sessionToken)}&` +
                    `proximity=${center[0]},${center[1]}&` +
                    `country=id&` +
                    `language=en&` +
                    `limit=5&` +
                    `types=poi`
                );

                if (!response.ok) {
                    throw new Error('Suggest failed');
                }

                const data = await response.json();
                const results = data.suggestions
                    ?.map((suggestion: any) => ({
                        id: suggestion.mapbox_id,
                        mapbox_id: suggestion.mapbox_id,
                        name: suggestion.name,
                        coordinates: suggestion.feature?.geometry?.coordinates || undefined,
                        place_type: suggestion.feature?.properties?.feature_type || 'poi',
                        full_address: suggestion.full_address || suggestion.address || '',
                    })) || [];

                setSearchResults(results);
                setShowResults(true);
            } catch (error) {
                console.error('Suggest error:', error);
                setSearchResults([]);
                setShowResults(false);
            } finally {
                setIsLoading(false);
            }
        },
        [sessionToken]
    );

    // Retrieve function
    const retrieveDetails = useCallback(
        async (mapboxId: string): Promise<SearchResult | null> => {
            try {
                const response = await fetch(
                    `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?` +
                    `access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&` +
                    `session_token=${encodeURIComponent(sessionToken)}`
                );

                if (!response.ok) {
                    throw new Error('Retrieve failed');
                }

                const data = await response.json();
                const feature = data.features?.[0];
                if (!feature) return null;

                return {
                    id: mapboxId,
                    mapbox_id: mapboxId,
                    name: feature.properties.name,
                    coordinates: feature.geometry.coordinates,
                    place_type: feature.properties.feature_type || 'poi',
                    full_address: feature.properties.full_address || '',
                    category: feature.properties.category || undefined,
                };
            } catch (error) {
                console.error('Retrieve error:', error);
                return null;
            }
        },
        [sessionToken]
    );

    // Handle search input
    const handleSearchInput = (value: string) => {
        setSearchQuery(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            searchLocations(value);
        }, 300);
    };

    // Handle location selection from search
    const handleLocationSelect = async (result: SearchResult) => {
        const detailedResult = await retrieveDetails(result.mapbox_id);
        if (!detailedResult || !detailedResult.coordinates) {
            console.error('Failed to retrieve valid POI details');
            return;
        }

        const [longitude, latitude] = detailedResult.coordinates;

        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [longitude, latitude],
                zoom: 14,
                duration: 1000,
            });
        }

        // Update or create marker
        if (markerRef.current) {
            markerRef.current.setLngLat([longitude, latitude]);
        } else {
            markerRef.current = new mapboxgl.Marker({ color: '#3b82f6' })
                .setLngLat([longitude, latitude])
                .addTo(mapRef.current!);
        }

        setCoordinates([`Longitude: ${longitude.toFixed(6)}`, `Latitude: ${latitude.toFixed(6)}`]);
        setSelectedLocation(detailedResult);
        setShowResults(false);
        setSearchQuery(detailedResult.name);

        if (onLocationSelect) {
            onLocationSelect(latitude, longitude);
        }

        console.log(`Selected: ${detailedResult.name}, Lat: ${latitude}, Lng: ${longitude}`);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
        setSelectedLocation(null);
        if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
        }
        setCoordinates(null);
        setSessionToken(uuidv4());
        if (onLocationSelect) {
            onLocationSelect(undefined, undefined);
        }
    };

    return (
        <div className="text-black relative" style={{ height: '400px' }}>
            {/* Search Interface */}
            <div className="absolute top-4 left-4 z-10 w-80">
                <Command>
                    <div className="p-1 rounded-2xl">
                        <div className="relative">
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                placeholder="Search"
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchQuery && (
                                <Button variant={"ghost"} size={"icon"} onClick={clearSearch} className="absolute size-6 right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <IconX/>
                                </Button>
                            )}
                            {isLoading && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    <CommandList>
                        {showResults && searchResults.length > 0 && (
                            <CommandGroup className="max-h-60 overflow-y-auto">
                                {searchResults.map((result) => (
                                    <CommandItem key={result.id} value={result.id} onSelect={() => handleLocationSelect(result)}>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="mt-0.5" />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{result.name}</div>
                                                <div className="text-sm text-gray-500">{result.full_address}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {result.coordinates && (
                                                        <div className="text-xs text-gray-400">
                                                            {result.coordinates[1].toFixed(6)}, {result.coordinates[0].toFixed(6)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {showResults && searchResults.length === 0 && !isLoading && searchQuery.length >= 3 && (
                            <CommandEmpty>No POIs found for "{searchQuery}"</CommandEmpty>
                        )}
                    </CommandList>
                </Command>

                {selectedLocation && (
                    <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="font-medium text-blue-900">{selectedLocation.name}</div>
                        <div className="text-xs text-blue-600 mt-1">
                            Lat: {selectedLocation.coordinates?.[1].toFixed(6)}, Lng:{' '}
                            {selectedLocation.coordinates?.[0].toFixed(6)}
                        </div>
                        {selectedLocation.category && (
                            <div className="text-xs text-blue-600 mt-1">Category: {selectedLocation.category}</div>
                        )}
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            {/* Coordinate Overlay */}
            <div
                style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: '#fff',
                    position: 'absolute',
                    bottom: '40px',
                    left: '10px',
                    padding: '5px 10px',
                    margin: 0,
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    lineHeight: '18px',
                    borderRadius: '3px',
                    display: coordinates ? 'block' : 'none',
                }}
            >
                {coordinates &&
                    coordinates.map((coord, index) => (
                        <p key={index} style={{ marginBottom: 0 }}>
                            {coord}
                        </p>
                    ))}
            </div>
        </div>
    );
};