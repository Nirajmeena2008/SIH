import React from 'react';
import { 
  CloudRain, 
  Droplets, 
  Wind, 
  Gauge, 
  Clock, 
  MapPin, 
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { RealStationData } from '../types';

interface LiveWeatherRiskCardProps {
  data: RealStationData;
  onOpenAiAnalysis: () => void;
  isAiLoading?: boolean;
}

export const LiveWeatherRiskCard: React.FC<LiveWeatherRiskCardProps> = ({
  data,
  onOpenAiAnalysis,
  isAiLoading = false,
}) => {
  const { weather, risk, location } = data;

  const weatherIconUrl = weather.weather_icons?.[0] || 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png';
  const weatherDesc = weather.weather_descriptions?.[0] || 'Mountain Weather';

  // Risk styling
  const isHighRisk = risk.level === 'CRITICAL' || risk.level === 'HIGH';
  const isModerateRisk = risk.level === 'MODERATE';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      
      {/* Top row: Location & Landslide Risk Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {location.name}
            </h2>
            <span className="text-sm font-medium text-slate-500">
              ({location.region})
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              {location.lat.toFixed(3)}°N, {location.lon.toFixed(3)}°E
            </span>
            {data.elevationMeters && (
              <span>· Elevation: ~{data.elevationMeters}m</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {weather.observation_time}
            </span>
          </div>
        </div>

        {/* Risk Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className={`px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs ${
              isHighRisk
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : isModerateRisk
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {isHighRisk ? (
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            ) : isModerateRisk ? (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{risk.statusTitle}</span>
          </div>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left: Weather condition & Temperature (5 cols) */}
        <div className="md:col-span-5 flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/90">
          <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 border border-slate-200 shadow-xs">
            <img 
              src={weatherIconUrl} 
              alt={weatherDesc} 
              className="w-12 h-12 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {weather.temperature}°C
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Feels like {weather.feelslike}°C
              </span>
            </div>
            <p className="text-sm font-bold text-slate-800 capitalize mt-0.5">
              {weatherDesc}
            </p>
            <span className="text-[11px] font-semibold text-emerald-700">
              Live Meteorological Station Telemetry
            </span>
          </div>
        </div>

        {/* Right: Landslide Advisory in Simple Words (7 cols) */}
        <div className="md:col-span-7 bg-slate-50 p-4 rounded-xl border border-slate-200/90 flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
              Safety Assessment for Travelers &amp; Citizens:
            </span>
            <p className="text-sm text-slate-600 leading-relaxed">
              {risk.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-medium">
              Need detailed geotechnical guidance?
            </span>
            
            <button
              onClick={onOpenAiAnalysis}
              disabled={isAiLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>{isAiLoading ? 'Analyzing...' : 'AI Analysis'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4 Essential Real Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        
        {/* Metric 1: Rainfall */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 shrink-0">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">Rainfall</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {weather.precip} <span className="text-xs font-normal text-slate-500">mm</span>
            </span>
          </div>
        </div>

        {/* Metric 2: Humidity */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">Humidity</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {weather.humidity}<span className="text-xs font-normal text-slate-500">%</span>
            </span>
          </div>
        </div>

        {/* Metric 3: Wind Speed */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">Wind</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {weather.wind_speed} <span className="text-xs font-normal text-slate-500">km/h ({weather.wind_dir})</span>
            </span>
          </div>
        </div>

        {/* Metric 4: Pressure */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">Air Pressure</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {weather.pressure} <span className="text-xs font-normal text-slate-500">mb</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
