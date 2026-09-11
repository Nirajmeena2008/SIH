import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  Navigation, 
  MapPin, 
  Send, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Eye,
  Home,
  Waves,
  Moon
} from 'lucide-react';
import { RealStationData } from '../types';

interface HighRiskWarningBannerProps {
  data: RealStationData;
  onOpenAuthorityModal: () => void;
  onOpenHelplines: () => void;
}

export const HighRiskWarningBanner: React.FC<HighRiskWarningBannerProps> = ({
  data,
  onOpenAuthorityModal,
  onOpenHelplines,
}) => {
  const { risk, location } = data;
  const { score, evacuationPlan, howToStaySafe, tectonicData } = risk;

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Safe Web Audio emergency tone toggle
  const toggleSiren = () => {
    if (isSirenPlaying) {
      setIsSirenPlaying(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
      setIsSirenPlaying(true);
      setTimeout(() => setIsSirenPlaying(false), 900);
    } catch {
      setIsSirenPlaying(false);
    }
  };

  const isSevere = score >= 75;

  return (
    <div className={`rounded-3xl p-5 sm:p-7 border-2 shadow-xs space-y-6 transition-all bg-white ${
      isSevere 
        ? 'border-rose-400/80 shadow-rose-100' 
        : 'border-amber-400/80 shadow-amber-100'
    }`}>
      
      {/* 1. URGENT WARNING HEADER */}
      <div className={`rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
        isSevere ? 'bg-rose-50/80 border-rose-200' : 'bg-amber-50/80 border-amber-200'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`p-3 rounded-2xl border shrink-0 animate-pulse ${
            isSevere ? 'bg-rose-100 border-rose-300 text-rose-700' : 'bg-amber-100 border-amber-300 text-amber-700'
          }`}>
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wider uppercase ${
                isSevere ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                {isSevere ? 'CODE RED: SEVERE THREAT' : 'ELEVATED WARNING'}
              </span>
              <span className={`text-xs font-mono font-bold ${
                isSevere ? 'text-rose-800' : 'text-amber-800'
              }`}>
                Risk Score: {score}/100 (&gt;50 Safety Threshold)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
              Active Landslide Warning for {location.name}, {location.region}
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Ground moisture saturation and tectonic micro-vibrations ({tectonicData.vibrationGal} Gal along the {tectonicData.faultLine}) have destabilized mountain slopes. Follow evacuation protocols and notify local authorities immediately.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto self-start md:self-center shrink-0">
          <button
            onClick={toggleSiren}
            title="Audio alert test"
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            {isSirenPlaying ? (
              <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
            <span className="hidden sm:inline">Sound Alarm</span>
          </button>

          <button
            onClick={onOpenAuthorityModal}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Send Warning to Authorities</span>
          </button>

          <button
            onClick={onOpenHelplines}
            className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <PhoneCall className="w-4 h-4 text-emerald-700" />
            <span>Dial 112</span>
          </button>
        </div>
      </div>

      {/* 2. TWO-COLUMN GRID: "HOW TO STAY SAFE" & "EVACUATION GUIDE" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLUMN A: HOW TO STAY SAFE */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
              How to Stay Safe (Immediate Life-Safety Rules)
            </h3>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shrink-0 mt-0.5">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">1. Vacate Dangerous Ground-Floor Rooms</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Move away from ground-floor bedrooms or rooms directly backing onto steep hillside cuts or mud embankments. Relocate to upper floors or reinforced interior rooms.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shrink-0 mt-0.5">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">2. Inspect Walls &amp; Foundation Creep</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Look for widening cracks in masonry, windows suddenly jamming, or utility pipes pulling apart. These are urgent precursors of foundational slope movement.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
              <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 shrink-0 mt-0.5">
                <Waves className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">3. Listen for Deep Ground Rumbling</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  A low train-like rumble, snapping trees, or clear drain water abruptly turning into thick brown mud means a debris avalanche is actively moving upslope. Evacuate sideways immediately.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 shrink-0 mt-0.5">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">4. Cease Night Travel on Mountain Passes</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Do not travel mountain highways after sunset during warning status. Stay in registered hotels or town shelters away from active road cuttings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN B: EVACUATION GUIDE */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-700" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                Evacuation Guide &amp; Protocol for {location.name}
              </h3>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
              Safe Zone Protocol
            </span>
          </div>

          {/* Local Designated Assembly Point */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Designated Safe Assembly Point:
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {evacuationPlan.assemblyPoint}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Maintain minimum <strong className="text-emerald-800">{evacuationPlan.bufferDistanceMeters}m</strong> clearance from sheer mountain cuts.
              </p>
            </div>
          </div>

          {/* Evacuation Routes */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              Primary Ridge Evacuation Corridors:
            </span>
            <div className="space-y-1.5">
              {evacuationPlan.evacuationRoutes.map((route, i) => (
                <div key={i} className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-xs text-slate-800 shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-semibold">{route}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Go-Bag Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Emergency Go-Bag Checklist:
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Check off packed items
              </span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {evacuationPlan.checklist.map((item, idx) => {
                const isChecked = Boolean(checkedItems[idx]);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 transition-all border ${
                      isChecked
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200 line-through'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* 3. SEND WARNING TO AUTHORITIES ACTION BAR */}
      <div className="bg-rose-50/70 p-4 sm:p-5 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Official Civil Defense Alert System
            </h4>
            <p className="text-xs text-slate-600">
              Transmit live telemetry to State Disaster Management (SDMA), NDRF 12th Bn, and District Police Control (112).
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuthorityModal}
          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Transmit Warning to Authorities</span>
        </button>
      </div>

    </div>
  );
};
