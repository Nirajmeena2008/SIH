import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  Mountain, 
  Globe2, 
  Radio, 
  Layers,
  Sparkles,
  Navigation
} from 'lucide-react';
import { StatePreset } from '../types';

interface StateLocationSelectorProps {
  states: StatePreset[];
  selectedStateId: string;
  selectedCity: string;
  onSelectState: (state: StatePreset) => void;
  onSelectCity: (city: string) => void;
  onSearchCity: (query: string) => void;
  isLoading: boolean;
}

export const StateLocationSelector: React.FC<StateLocationSelectorProps> = ({
  states,
  selectedStateId,
  selectedCity,
  onSelectState,
  onSelectCity,
  onSearchCity,
  isLoading,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const activeState = states.find((s) => s.id === selectedStateId) || states[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchCity(searchInput.trim());
      setSearchInput('');
    }
  };

  // Handle State Dropdown Change
  const handleStateDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    const targetState = states.find((s) => s.id === stateId);
    if (targetState) {
      onSelectState(targetState);
    }
  };

  // Handle Town Dropdown Change
  const handleTownDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val.startsWith('STATE:')) {
      const parts = val.split(':');
      const sId = parts[1];
      const city = parts[2];
      const targetState = states.find((s) => s.id === sId);
      if (targetState) {
        onSelectState(targetState);
      }
      onSelectCity(city);
    } else if (val) {
      onSelectCity(val);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      
      {/* 1. LOCATION SELECTION CONTROLS (Optimized for Mobile & PC) */}
      <div className="space-y-3">
        
        {/* Header label */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Select Monitoring Station &amp; Region</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  11 Hilly States
                </span>
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Active: <strong className="text-white">{selectedCity}, {activeState?.name}</strong></span>
          </div>
        </div>

        {/* Primary Row: DROPDOWNS (State + Town) & Instant Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Dropdown 1: State / Region Dropdown */}
          <div className="lg:col-span-4 relative">
            <label 
              htmlFor="state-region-select" 
              className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
            >
              State / Region:
            </label>
            <div className="relative">
              <select
                id="state-region-select"
                value={selectedStateId}
                onChange={handleStateDropdownChange}
                aria-label="Select State or Region"
                className="w-full appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 pl-9 pr-10 text-xs sm:text-sm font-semibold text-white focus:outline-none shadow-sm transition-colors cursor-pointer"
              >
                {states.map((st) => (
                  <option key={st.id} value={st.id} className="bg-slate-900 text-white py-1">
                    {st.name} ({st.defaultCity})
                  </option>
                ))}
              </select>
              <Mountain className="w-4 h-4 text-sky-400 absolute left-3 top-3 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Dropdown 2: City / Town Dropdown */}
          <div className="lg:col-span-4 relative">
            <label 
              htmlFor="station-town-select" 
              className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
            >
              Town / Station:
            </label>
            <div className="relative">
              <select
                id="station-town-select"
                value={
                  activeState?.cities.some((c) => c.toLowerCase() === selectedCity.toLowerCase())
                    ? selectedCity
                    : `STATE:${activeState?.id}:${selectedCity}`
                }
                onChange={handleTownDropdownChange}
                aria-label="Select Town or Monitoring Station"
                className="w-full appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 pl-9 pr-10 text-xs sm:text-sm font-semibold text-white focus:outline-none shadow-sm transition-colors cursor-pointer"
              >
                <optgroup label={`Stations in ${activeState?.name}`}>
                  {activeState?.cities.map((city) => (
                    <option key={city} value={city} className="bg-slate-900 text-white py-1">
                      {city}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Quick Jump to All Indian Hill Stations">
                  {states.map((st) =>
                    st.cities.map((ct) => (
                      <option 
                        key={`${st.id}-${ct}`} 
                        value={`STATE:${st.id}:${ct}`}
                        className="bg-slate-900 text-slate-200 py-1"
                      >
                        {ct} ({st.name})
                      </option>
                    ))
                  )}
                </optgroup>
              </select>
              <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-3 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Search Bar for Any Hill City or District */}
          <div className="sm:col-span-2 lg:col-span-4">
            <label 
              htmlFor="hill-city-search" 
              className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
            >
              Search Any City / District:
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="hill-city-search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g. Gangtok, Shimla, Wayanad..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-20 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <button
                type="submit"
                disabled={isLoading || !searchInput.trim()}
                className="absolute right-1.5 top-1 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg transition-colors"
              >
                Search
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* 2. ACTIVE REGION & TERRAIN CARD (Prominently visible on BOTH Mobile & PC) */}
      {activeState && (
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5 sm:p-4 space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-indigo-400" />
                <span>Region: {activeState.name}</span>
              </span>
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <Navigation className="w-3 h-3 text-sky-400" />
                Current Station: <strong className="text-white">{selectedCity}</strong>
              </span>
            </div>

            {/* Quick Towns Buttons in this State */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-1">
                Stations:
              </span>
              {activeState.cities.map((city) => {
                const isActiveCity = selectedCity.toLowerCase() === city.toLowerCase();
                return (
                  <button
                    key={city}
                    onClick={() => onSelectCity(city)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isActiveCity
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Terrain & Vulnerability Profile - Visible to mobile & PC users */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Terrain &amp; Corridors: </strong>
                <span className="text-slate-400">{activeState.terrain}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Hazard &amp; Vulnerability: </strong>
                <span className="text-slate-400">{activeState.riskProfile}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. QUICK STATE CHIPS (Carousel on Mobile, Grid/Wrapped on PC) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Quick State Switcher:
          </span>
          <span className="text-[11px] text-slate-500">
            Tap any region or use dropdown above
          </span>
        </div>

        {/* Responsive state pill row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {states.map((st) => {
            const isSelected = st.id === selectedStateId;
            return (
              <button
                key={st.id}
                onClick={() => onSelectState(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <MapPin className={`w-3 h-3 ${isSelected ? 'text-sky-300' : 'text-slate-500'}`} />
                <span>{st.name}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
