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
    <div className={`rounded-xl p-5 sm:p-6 border shadow-2xl space-y-6 transition-all ${
      isSevere 
        ? 'bg-gradient-to-b from-rose-950/80 via-slate-900 to-slate-950 border-rose-600/70 shadow-rose-950/50' 
        : 'bg-gradient-to-b from-orange-950/70 via-slate-900 to-slate-950 border-orange-500/60 shadow-orange-950/40'
    }`}>
      
      {/* 1. URGENT WARNING HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-rose-500/30">
        <div className="flex items-start gap-3.5">
          <div className={`p-3 rounded-xl border shrink-0 animate-pulse ${
            isSevere ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-orange-500/20 border-orange-500/50 text-orange-400'
          }`}>
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-xs font-black tracking-wider uppercase ${
                isSevere ? 'bg-rose-600 text-white' : 'bg-orange-600 text-white'
              }`}>
                {isSevere ? 'CODE RED: SEVERE THREAT' : 'ELEVATED WARNING'}
              </span>
              <span className="text-sm font-mono font-bold text-rose-300">
                Risk Score: {score}/100 (&gt;50 Safety Threshold)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Active Landslide Warning for {location.name}, {location.region}
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Ground moisture saturation and tectonic micro-vibrations ({tectonicData.vibrationGal} Gal along the {tectonicData.faultLine}) have destabilized mountain slopes. Follow evacuation protocols and notify local authorities immediately.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto self-start md:self-center shrink-0">
          <button
            onClick={toggleSiren}
            title="Audio alert test"
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            {isSirenPlaying ? (
              <VolumeX className="w-4 h-4 text-rose-400 animate-pulse" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
            <span className="hidden sm:inline">Sound Alarm</span>
          </button>

          <button
            onClick={onOpenAuthorityModal}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Send Warning to Authorities</span>
          </button>

          <button
            onClick={onOpenHelplines}
            className="px-3 py-2.5 rounded-lg font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Dial 112</span>
          </button>
        </div>
      </div>

      {/* 2. TWO-COLUMN GRID: "HOW TO STAY SAFE" & "EVACUATION GUIDE" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLUMN A: HOW TO STAY SAFE */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <ShieldAlert className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
              How to Stay Safe (Immediate Life-Safety Rules)
            </h3>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0 mt-0.5">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">1. Vacate Dangerous Ground-Floor Rooms</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Move away from ground-floor bedrooms or rooms directly backing onto steep hillside cuts or mud embankments. Relocate to upper floors or reinforced interior rooms.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">2. Inspect Walls &amp; Foundation Creep</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Look for widening cracks in masonry, windows suddenly jamming, or utility pipes pulling apart. These are urgent precursors of foundational slope movement.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0 mt-0.5">
                <Waves className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">3. Listen for Deep Ground Rumbling</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  A low train-like rumble, snapping trees, or clear drain water abruptly turning into thick brown mud means a debris avalanche is actively moving upslope. Evacuate sideways immediately.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">4. Cease Night Travel on Mountain Passes</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Do not travel mountain highways after sunset during warning status. Stay in registered hotels or town shelters away from active road cuttings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN B: EVACUATION GUIDE */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
                Evacuation Guide &amp; Protocol for {location.name}
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
              Safe Zone Protocol
            </span>
          </div>

          {/* Local Designated Assembly Point */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 p-3.5 rounded-lg flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                Designated Safe Assembly Point:
              </span>
              <p className="text-sm font-bold text-white mt-0.5">
                {evacuationPlan.assemblyPoint}
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Maintain minimum <strong className="text-emerald-300">{evacuationPlan.bufferDistanceMeters}m</strong> clearance from sheer mountain cuts.
              </p>
            </div>
          </div>

          {/* Evacuation Routes */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
              Primary Ridge Evacuation Corridors:
            </span>
            <div className="space-y-1.5">
              {evacuationPlan.evacuationRoutes.map((route, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg flex items-center gap-2 text-xs text-slate-200">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-medium">{route}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Go-Bag Checklist */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Emergency Go-Bag Checklist:
              </span>
              <span className="text-[11px] text-slate-400">
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
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 transition-all border ${
                      isChecked
                        ? 'bg-emerald-950/40 text-emerald-200 border-emerald-800/40 line-through'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0" />
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
      <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Official Civil Defense Alert System
            </h4>
            <p className="text-xs text-slate-400">
              Transmit live telemetry to State Disaster Management (SDMA), NDRF 12th Bn, and District Police Control (112).
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuthorityModal}
          className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Send className="w-4 h-4" />
          <span>Transmit Warning to Authorities</span>
        </button>
      </div>

    </div>
  );
};
