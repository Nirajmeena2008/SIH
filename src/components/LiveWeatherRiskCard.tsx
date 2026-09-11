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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
      
      {/* Top row: Location & Landslide Risk Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {location.name}
            </h2>
            <span className="text-sm font-medium text-slate-400">
              ({location.region})
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-sky-400" />
              {location.lat.toFixed(3)}°N, {location.lon.toFixed(3)}°E
            </span>
            {data.elevationMeters && (
              <span>· Elevation: ~{data.elevationMeters}m</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {weather.observation_time}
            </span>
          </div>
        </div>

        {/* Risk Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className={`px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
              isHighRisk
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : isModerateRisk
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
            }`}
          >
            {isHighRisk ? (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            ) : isModerateRisk ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{risk.statusTitle}</span>
          </div>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left: Weather condition & Temperature (5 cols) */}
        <div className="md:col-span-5 flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="w-16 h-16 rounded-xl bg-slate-800/80 p-2 flex items-center justify-center shrink-0 border border-slate-700/50 shadow-inner">
            <img 
              src={weatherIconUrl} 
              alt={weatherDesc} 
              className="w-12 h-12 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {weather.temperature}°C
              </span>
              <span className="text-xs text-slate-400">
                Feels like {weather.feelslike}°C
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200 capitalize mt-0.5">
              {weatherDesc}
            </p>
            <span className="text-[11px] text-sky-400">
              Direct Weatherstack Observation
            </span>
          </div>
        </div>

        {/* Right: Landslide Advisory in Simple Words (7 cols) */}
        <div className="md:col-span-7 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Safety Assessment for Travelers & Citizens:
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">
              {risk.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">
              Need practical road safety advice?
            </span>
            
            {/* The user requested: "change the ask gemini ai option text to just ai analysis" */}
            <button
              onClick={onOpenAiAnalysis}
              disabled={isAiLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>{isAiLoading ? 'Analyzing...' : 'AI Analysis'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4 Essential Real Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        
        {/* Metric 1: Rainfall */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block uppercase">Rainfall</span>
            <span className="text-lg font-bold text-white font-mono">
              {weather.precip} <span className="text-xs font-normal text-slate-400">mm</span>
            </span>
          </div>
        </div>

        {/* Metric 2: Humidity */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block uppercase">Humidity</span>
            <span className="text-lg font-bold text-white font-mono">
              {weather.humidity}<span className="text-xs font-normal text-slate-400">%</span>
            </span>
          </div>
        </div>

        {/* Metric 3: Wind Speed */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block uppercase">Wind</span>
            <span className="text-lg font-bold text-white font-mono">
              {weather.wind_speed} <span className="text-xs font-normal text-slate-400">km/h ({weather.wind_dir})</span>
            </span>
          </div>
        </div>

        {/* Metric 4: Pressure */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block uppercase">Air Pressure</span>
            <span className="text-lg font-bold text-white font-mono">
              {weather.pressure} <span className="text-xs font-normal text-slate-400">mb</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
