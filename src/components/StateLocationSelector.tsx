import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3.5">
      
      {/* Top: Search & Quick City dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* City / District Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search any Indian hill city or district (e.g., Gangtok, Shimla, Manali)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-20 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <button
            type="submit"
            disabled={isLoading || !searchInput.trim()}
            className="absolute right-1.5 top-1 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-md transition-colors"
          >
            Search
          </button>
        </form>

        {/* Cities in current state */}
        {activeState && activeState.cities.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 whitespace-nowrap hidden md:inline">Key towns:</span>
            <div className="flex flex-wrap gap-1.5">
              {activeState.cities.map((city) => (
                <button
                  key={city}
                  onClick={() => onSelectCity(city)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedCity.toLowerCase() === city.toLowerCase()
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* State Selection Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select State / Region:
          </span>
          {activeState && (
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {activeState.terrain}
            </span>
          )}
        </div>

        {/* Scrollable chip container */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
          {states.map((st) => {
            const isSelected = st.id === selectedStateId;
            return (
              <button
                key={st.id}
                onClick={() => onSelectState(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
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
