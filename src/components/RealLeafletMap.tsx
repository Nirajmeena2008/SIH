import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';
import { RealStationData } from '../types';

interface RealLeafletMapProps {
  station: RealStationData;
}

export const RealLeafletMap: React.FC<RealLeafletMapProps> = ({ station }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const { lat, lon } = station.location;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix default Leaflet icon paths in React / Vite bundle
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = defaultIcon;

    // Initialize map if not yet created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 12,
        zoomControl: true,
        attributionControl: true,
      });

      // Standard OpenStreetMap tiles (free, reliable, global coverage including India highways)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Smoothly fly or pan to the updated location
    map.setView([lat, lon], 12);

    // Remove previous marker if exists
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Build friendly popup HTML with real Weatherstack data
    const popupContent = `
      <div style="font-family: sans-serif; padding: 4px; min-width: 170px;">
        <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px; color: #ffffff;">
          ${station.location.name}
        </div>
        <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">
          ${station.location.region}, India
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <img src="${station.weather.weather_icons?.[0] || ''}" style="width: 28px; height: 28px; border-radius: 4px;" alt="weather" />
          <div>
            <div style="font-size: 16px; font-weight: 800; color: #38bdf8;">
              ${station.weather.temperature}°C
            </div>
            <div style="font-size: 11px; color: #cbd5e1;">
              ${station.weather.weather_descriptions?.[0] || ''}
            </div>
          </div>
        </div>
        <div style="border-top: 1px solid #334155; padding-top: 6px; font-size: 11px; display: flex; justify-content: space-between; color: #e2e8f0;">
          <span>Rainfall: <b>${station.weather.precip} mm</b></span>
          <span>Humidity: <b>${station.weather.humidity}%</b></span>
        </div>
        <div style="margin-top: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${station.risk.colorHex};">
          Threat: ${station.risk.statusTitle}
        </div>
      </div>
    `;

    const marker = L.marker([lat, lon])
      .addTo(map)
      .bindPopup(popupContent, { closeButton: false })
      .openPopup();

    markerRef.current = marker;

    // Invalidate size after initial render to fix container sizing
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      // Map cleanup on unmount
    };
  }, [lat, lon, station]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lon], 12);
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col relative isolate z-0">
      
      {/* Map Header */}
      <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <h3 className="font-bold text-sm text-white">
            Geographic Location & Road Network Map
          </h3>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            (OpenStreetMap Real Satellite/Road Tiles)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleRecenter}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Recenter on city location"
          >
            <Navigation className="w-3 h-3 text-sky-400" />
            <span>Center on {station.city}</span>
          </button>
        </div>
      </div>

      {/* Map Body Container */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating coordinates badge */}
        <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-slate-300 shadow-lg flex items-center gap-2 pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span>
            {station.city}: <strong className="text-white">{lat.toFixed(3)}°N, {lon.toFixed(3)}°E</strong>
          </span>
        </div>

        {/* Floating live weather overlay */}
        <div className="absolute top-3 right-3 z-10 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-slate-200 shadow-lg flex items-center gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Coordinates from Weatherstack</span>
        </div>
      </div>

      {/* Map Footer Note */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between px-4">
        <span>Map shows real roads, rivers, and elevation contours around {station.city}, {station.state}.</span>
        <span className="hidden sm:inline">Zoom or pan to explore nearby mountain routes</span>
      </div>

    </div>
  );
};
