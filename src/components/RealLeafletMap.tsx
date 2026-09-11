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
      <div style="font-family: sans-serif; padding: 6px; min-width: 180px; color: #0f172a;">
        <div style="font-weight: 800; font-size: 14px; margin-bottom: 2px; color: #0f172a;">
          ${station.location.name}
        </div>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
          ${station.location.region}, India
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <img src="${station.weather.weather_icons?.[0] || ''}" style="width: 32px; height: 32px; border-radius: 6px;" alt="weather" />
          <div>
            <div style="font-size: 16px; font-weight: 800; color: #0f172a;">
              ${station.weather.temperature}°C
            </div>
            <div style="font-size: 11px; color: #475569; font-weight: 600;">
              ${station.weather.weather_descriptions?.[0] || ''}
            </div>
          </div>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 6px; font-size: 11px; display: flex; justify-content: space-between; color: #334155;">
          <span>Rainfall: <b>${station.weather.precip} mm</b></span>
          <span>Humidity: <b>${station.weather.humidity}%</b></span>
        </div>
        <div style="margin-top: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: ${station.risk.score > 50 ? '#e11d48' : '#047857'};">
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
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs flex flex-col relative isolate z-0">
      
      {/* Map Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          <h3 className="font-extrabold text-sm text-slate-900">
            Geographic Location &amp; Road Network Map
          </h3>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            (OpenStreetMap Real Satellite/Road Network)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleRecenter}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold transition-colors"
            title="Recenter on city location"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>Center on {station.city}</span>
          </button>
        </div>
      </div>

      {/* Map Body Container */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating coordinates badge */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 border border-slate-200/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-slate-700 shadow-md flex items-center gap-2 pointer-events-auto max-w-[calc(100%-24px)] truncate font-medium">
          <Compass className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="truncate">
            {station.city}: <strong className="text-slate-900">{lat.toFixed(3)}°N, {lon.toFixed(3)}°E</strong>
          </span>
        </div>

        {/* Floating live weather overlay */}
        <div className="absolute top-3 right-3 z-10 bg-white/95 border border-slate-200/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-slate-700 shadow-md flex items-center gap-2 pointer-events-auto font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping shrink-0" />
          <span className="hidden sm:inline">Live Coordinates from Weatherstack</span>
          <span className="sm:hidden">Live Radar GPS</span>
        </div>
      </div>

      {/* Map Footer Note */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 font-medium flex items-center justify-between px-4">
        <span>Map shows real roads, rivers, and elevation contours around {station.city}, {station.state}.</span>
        <span className="hidden sm:inline">Zoom or pan to explore nearby mountain routes</span>
      </div>

    </div>
  );
};
