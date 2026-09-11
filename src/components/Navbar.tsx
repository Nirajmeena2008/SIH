import React from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Radio, 
  PhoneCall,
  MapPin,
  Languages,
  Shield,
  Sparkles,
  ChevronDown
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand & Identity (matching GramBiz AI green brand icon and title) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-xs shrink-0 select-none">
              L
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight truncate">
                  Landslide AI
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
                  Live Sensor Network
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="font-medium text-slate-700 truncate">
                  {currentCity}, {currentState}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons & Navigation Pills */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language / Region pill (reference style) */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold shadow-xs">
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>English</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* AI Analysis Quick Button in Emerald */}
            <button
              onClick={onOpenAiAnalysis}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-xs"
              title="Open AI Analysis for current location"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">AI Analysis</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Helpline Modal Trigger */}
            <button
              onClick={onOpenHelpline}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors"
              title="Emergency Helplines (112)"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden md:inline">Helplines (112)</span>
              <span className="md:hidden">112</span>
            </button>

            {/* System Status Shield Pill */}
            <div 
              className="hidden sm:flex p-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-xs"
              title="Telemetry Guard Active"
            >
              <Shield className="w-4 h-4" />
            </div>

            {/* Live Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Refresh live weather data"
            >
              <RefreshCw className={`w-4 h-4 text-slate-600 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
