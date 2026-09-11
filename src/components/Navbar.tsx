import React from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Radio, 
  PhoneCall,
  MapPin
} from 'lucide-react';

interface NavbarProps {
  currentCity: string;
  currentState: string;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenHelpline: () => void;
  onOpenAiAnalysis: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  currentState,
  onRefresh,
  isLoading,
  onOpenHelpline,
  onOpenAiAnalysis,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-lg text-white tracking-tight truncate">
                  <span className="hidden sm:inline">Landslide &amp; Weather Advisory</span>
                  <span className="sm:hidden">Landslide Advisory</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <Radio className="w-3 h-3 animate-pulse" />
                  Live Weatherstack
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="font-semibold text-white truncate bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
                  {currentCity}, {currentState}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* AI Analysis Quick Button */}
            <button
              onClick={onOpenAiAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm shadow-indigo-600/30"
              title="Open AI Analysis for current location"
            >
              <span className="hidden sm:inline">AI Analysis</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Helpline Modal Trigger */}
            <button
              onClick={onOpenHelpline}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Emergency Helplines"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Helplines (112)</span>
              <span className="md:hidden">112</span>
            </button>

            {/* Live Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Refresh live weather data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
