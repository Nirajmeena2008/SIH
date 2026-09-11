import React from 'react';
import { 
  Activity, 
  CloudRain, 
  Mountain, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  Radio, 
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import { RealStationData } from '../types';

interface RiskScorePanelProps {
  data: RealStationData;
  onOpenAuthorityModal: () => void;
  onSimulate: (tremorGal: number, extraRain: number) => void;
  activeSimulation: string;
}

export const RiskScorePanel: React.FC<RiskScorePanelProps> = ({
  data,
  onOpenAuthorityModal,
  onSimulate,
  activeSimulation,
}) => {
  const { risk, weather, elevationMeters, city, state } = data;
  const { score, level, isWarningActive, scoreBreakdown, tectonicData } = risk;

  // Determine colors based on 1-100 scale
  let scoreColorClass = 'text-emerald-700';
  let progressBgClass = 'bg-emerald-600';
  let badgeBorderClass = 'border-emerald-200 bg-emerald-50 text-emerald-800';
  let riskTitle = 'Normal Range / Safe';

  if (score >= 75) {
    scoreColorClass = 'text-rose-700';
    progressBgClass = 'bg-rose-600';
    badgeBorderClass = 'border-rose-200 bg-rose-50 text-rose-800';
    riskTitle = 'Critical Danger (>75)';
  } else if (score > 50) {
    scoreColorClass = 'text-amber-700';
    progressBgClass = 'bg-amber-500';
    badgeBorderClass = 'border-amber-200 bg-amber-50 text-amber-800';
    riskTitle = 'Warning: Exceeds Threshold (>50)';
  } else if (score >= 30) {
    scoreColorClass = 'text-emerald-700';
    progressBgClass = 'bg-emerald-600';
    badgeBorderClass = 'border-emerald-200 bg-emerald-50 text-emerald-800';
    riskTitle = 'Moderate / Stable';
  }

  return (
    <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/90 space-y-6 relative overflow-hidden">
      
      {/* Eyebrow and Header matching clean light theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>TAB 1 • EARLY WARNING &amp; COMPOSITE TELEMETRY</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Real-Time Landslide Hazard Assessment
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Scientific multi-sensor telemetry combining live rainfall precipitation with active tectonic plate movement rates, micro-vibrations, and mountain slope relief.
          </p>
        </div>

        {/* Warning Badge & Trigger Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className={`px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs ${badgeBorderClass}`}>
            {isWarningActive ? (
              <ShieldAlert className="w-4 h-4 text-amber-600 animate-pulse" />
            ) : score >= 30 ? (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            )}
            <span>{riskTitle}</span>
          </div>

          {isWarningActive && (
            <button
              onClick={onOpenAuthorityModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Alert Authorities</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Score Display & Multi-factor breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: 1-100 Score Meter in Inner Stat Card (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xs">
          
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Composite Score
          </span>

          {/* Large Score Indicator */}
          <div className="relative w-36 h-36 flex flex-col items-center justify-center rounded-full border-4 border-slate-200 shadow-xs my-1 bg-white">
            <span className={`text-5xl font-black font-mono tracking-tighter ${scoreColorClass}`}>
              {score}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              out of 100
            </span>

            {/* Sub-label for threshold status */}
            <div className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-xs">
              {score > 50 ? 'THRESHOLD EXCEEDED' : 'NORMAL RANGE'}
            </div>
          </div>

          {/* Linear bar underneath */}
          <div className="w-full mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500">
              <span>Low (1-30)</span>
              <span>Caution (31-50)</span>
              <span className="text-amber-700 font-bold">Alert (&gt;50)</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300/60">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${progressBgClass}`}
                style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
              />
            </div>
          </div>

          {/* Threshold alert note */}
          {isWarningActive && (
            <p className="text-[11px] text-amber-800 font-semibold mt-3.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5 text-left shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>Score is above 50: Safety &amp; Evacuation Protocols Activated</span>
            </p>
          )}
        </div>

        {/* Right: 3 Calamity Prediction Factors (8 cols) */}
        <div className="lg:col-span-8 space-y-3 flex flex-col justify-between">
          
          {/* Factor 1: Rainfall & Precipitation Saturation (0-45 pts) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 shrink-0 mt-0.5 shadow-xs">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    1. Rainfall &amp; Soil Moisture Saturation
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200 font-bold">
                    Max 45 Pts
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Live rainfall rate: <span className="text-slate-900 font-bold">{weather.precip} mm</span> · Relative soil humidity: <span className="text-slate-900 font-bold">{weather.humidity}%</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:text-right shrink-0">
              <div>
                <span className="text-base font-extrabold font-mono text-sky-700">
                  +{scoreBreakdown?.rainfallPoints ?? Math.round(weather.precip * 3)}
                </span>
                <span className="text-[10px] text-slate-500 block font-medium">points</span>
              </div>
            </div>
          </div>

          {/* Factor 2: Tectonic Plate Movements & Seismic Vibrations (0-35 pts) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shrink-0 mt-0.5 shadow-xs">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    2. Tectonic Plate Movement &amp; Seismic Vibrations
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 font-bold">
                    Max 35 Pts
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Fault line: <span className="text-slate-900 font-semibold">{tectonicData.faultLine}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                  <span className="text-slate-600">
                    Ground Vibration (PGA): <strong className="text-amber-700 font-mono">{tectonicData.vibrationGal} Gal</strong>
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-600">
                    Convergence: <strong className="text-slate-900">{tectonicData.plateMovementRate}</strong>
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    tectonicData.tremorStatus === 'ACTIVE_SEISMIC'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                      : tectonicData.tremorStatus === 'MICRO_TREMOR'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {tectonicData.tremorStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:text-right shrink-0">
              <div>
                <span className="text-base font-extrabold font-mono text-amber-700">
                  +{scoreBreakdown?.tectonicPoints ?? 12}
                </span>
                <span className="text-[10px] text-slate-500 block font-medium">points</span>
              </div>
            </div>
          </div>

          {/* Factor 3: Slope Gravity & Mountain Relief (0-20 pts) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0 mt-0.5 shadow-xs">
                <Mountain className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    3. Slope Gradient &amp; Gravitational Stress
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                    Max 20 Pts
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Elevation: <span className="text-slate-900 font-bold">{elevationMeters || 1200} m</span> · Mountain slope cutting relief &amp; watershed angle
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:text-right shrink-0">
              <div>
                <span className="text-base font-extrabold font-mono text-emerald-700">
                  +{scoreBreakdown?.slopePoints ?? 9}
                </span>
                <span className="text-[10px] text-slate-500 block font-medium">points</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Testing / Scenario Simulator Bar */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Scenario Simulation &amp; Threshold Tester:
            </span>
            <span className="text-[11px] text-slate-500">
              Test how tectonic micro-vibrations &amp; cloudburst rain push the score above 50:
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onSimulate(0, 0)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold text-center transition-all ${
              activeSimulation === 'live'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Live Baseline
          </button>

          <button
            onClick={() => onSimulate(18, 0)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold text-center transition-all ${
              activeSimulation === 'tremor'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            +18 Gal Tremor
          </button>

          <button
            onClick={() => onSimulate(0, 14)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold text-center transition-all ${
              activeSimulation === 'rain'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-sky-800 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            +14mm Cloudburst
          </button>

          <button
            onClick={() => onSimulate(22, 16)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold text-center transition-all ${
              activeSimulation === 'critical'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-800 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            Critical Alert (&gt;50)
          </button>
        </div>
      </div>

    </div>
  );
};
