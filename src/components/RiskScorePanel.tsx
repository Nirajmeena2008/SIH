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
  Zap
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
  const { risk, weather, elevationMeters } = data;
  const { score, level, isWarningActive, scoreBreakdown, tectonicData } = risk;

  // Determine colors based on 1-100 scale
  let scoreColorClass = 'text-emerald-400';
  let progressBgClass = 'bg-emerald-500';
  let badgeBorderClass = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
  let riskTitle = 'Safe / Low Threat';

  if (score >= 75) {
    scoreColorClass = 'text-rose-400';
    progressBgClass = 'bg-rose-500';
    badgeBorderClass = 'border-rose-500/50 bg-rose-500/20 text-rose-300';
    riskTitle = 'Critical Landslide Danger';
  } else if (score > 50) {
    scoreColorClass = 'text-orange-400';
    progressBgClass = 'bg-orange-500';
    badgeBorderClass = 'border-orange-500/50 bg-orange-500/20 text-orange-300';
    riskTitle = 'Warning: Exceeds Threshold (>50)';
  } else if (score >= 30) {
    scoreColorClass = 'text-amber-400';
    progressBgClass = 'bg-amber-500';
    badgeBorderClass = 'border-amber-500/40 bg-amber-500/10 text-amber-300';
    riskTitle = 'Moderate Caution';
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-400" />
              Composite Landslide Risk Score (1-100)
            </h3>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              [Scientific Multi-Factor Formula]
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Combines live rainfall saturation with active tectonic plate movements, seismic micro-vibrations, and mountain slope relief.
          </p>
        </div>

        {/* Warning Badge & Trigger Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${badgeBorderClass}`}>
            {isWarningActive ? (
              <ShieldAlert className="w-4 h-4 text-orange-400 animate-pulse" />
            ) : score >= 30 ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{riskTitle}</span>
          </div>

          {isWarningActive && (
            <button
              onClick={onOpenAuthorityModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all animate-bounce"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Alert Authorities</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Score Display & Multi-factor breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        
        {/* Left: 1-100 Score Meter (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
          
          {/* Circular / Large Score Indicator */}
          <div className="relative w-36 h-36 flex flex-col items-center justify-center rounded-full border-4 border-slate-800 shadow-inner my-2">
            <span className={`text-5xl font-black font-mono tracking-tighter ${scoreColorClass}`}>
              {score}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              out of 100
            </span>

            {/* Sub-label for threshold status */}
            <div className="absolute -bottom-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
              {score > 50 ? 'THRESHOLD EXCEEDED' : 'NORMAL RANGE'}
            </div>
          </div>

          {/* Linear bar underneath */}
          <div className="w-full mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium text-slate-400">
              <span>Low (1-30)</span>
              <span>Caution (31-50)</span>
              <span className="text-orange-400 font-bold">Alert (&gt;50)</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${progressBgClass}`}
                style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
              />
            </div>
          </div>

          {/* Threshold alert note */}
          {isWarningActive && (
            <p className="text-[11px] text-orange-300 font-medium mt-3 bg-orange-950/40 px-2.5 py-1.5 rounded-lg border border-orange-800/50 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-orange-400" />
              <span>Score is above 50: Safety &amp; Evacuation Protocols Activated</span>
            </p>
          )}
        </div>

        {/* Right: 3 Calamity Prediction Factors (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* Factor 1: Rainfall & Precipitation Saturation (0-45 pts) */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0 mt-0.5">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-200">
                    1. Rainfall &amp; Soil Moisture Saturation
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950/60 text-sky-300 border border-sky-800/40">
                    Max 45 Pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Live rainfall rate: <span className="text-slate-200 font-semibold">{weather.precip} mm</span> · Relative soil humidity: <span className="text-slate-200 font-semibold">{weather.humidity}%</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:text-right shrink-0">
              <div>
                <span className="text-sm font-bold font-mono text-sky-400">
                  +{scoreBreakdown?.rainfallPoints ?? Math.round(weather.precip * 3)}
                </span>
                <span className="text-[10px] text-slate-500 block">points</span>
              </div>
            </div>
          </div>

          {/* Factor 2: Tectonic Plate Movements & Seismic Vibrations (0-35 pts) */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-200">
                    2. Tectonic Plate Movement &amp; Seismic Vibrations
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                    Max 35 Pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Fault line: <span className="text-slate-200 font-medium">{tectonicData.faultLine}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                  <span className="text-slate-400">
                    Ground Vibration (PGA): <strong className="text-amber-300 font-mono">{tectonicData.vibrationGal} Gal</strong>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">
                    Convergence: <strong className="text-slate-300">{tectonicData.plateMovementRate}</strong>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    tectonicData.tremorStatus === 'ACTIVE_SEISMIC'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : tectonicData.tremorStatus === 'MICRO_TREMOR'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {tectonicData.tremorStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:text-right shrink-0">
              <div>
                <span className="text-sm font-bold font-mono text-amber-400">
                  +{scoreBreakdown?.tectonicPoints ?? 12}
                </span>
                <span className="text-[10px] text-slate-500 block">points</span>
              </div>
            </div>
          </div>

          {/* Factor 3: Slope Gravity & Mountain Relief (0-20 pts) */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0 mt-0.5">
                <Mountain className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-200">
                    3. Slope Gradient &amp; Gravitational Stress
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-950/60 text-teal-300 border border-teal-800/40">
                    Max 20 Pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Elevation: <span className="text-slate-200 font-semibold">{elevationMeters || 1200} m</span> · Mountain slope cutting relief &amp; watershed angle
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:text-right shrink-0">
              <div>
                <span className="text-sm font-bold font-mono text-teal-400">
                  +{scoreBreakdown?.slopePoints ?? 9}
                </span>
                <span className="text-[10px] text-slate-500 block">points</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Testing / Scenario Simulator Bar */}
      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-200 block">
              Scenario Simulation &amp; Threshold Tester:
            </span>
            <span className="text-[11px] text-slate-400">
              Test how tectonic micro-vibrations &amp; cloudburst rain push the score above 50:
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => onSimulate(0, 0)}
            className={`px-2.5 py-2 sm:py-1 rounded-lg text-xs font-semibold text-center transition-all ${
              activeSimulation === 'live'
                ? 'bg-slate-700 text-white font-bold border border-slate-600 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
            }`}
          >
            Live Baseline
          </button>

          <button
            onClick={() => onSimulate(18, 0)}
            className={`px-2.5 py-2 sm:py-1 rounded-lg text-xs font-semibold text-center transition-all ${
              activeSimulation === 'tremor'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'bg-slate-800/80 text-amber-300 hover:bg-amber-950/40 border border-amber-800/50'
            }`}
          >
            +18 Gal Tremor
          </button>

          <button
            onClick={() => onSimulate(0, 14)}
            className={`px-2.5 py-2 sm:py-1 rounded-lg text-xs font-semibold text-center transition-all ${
              activeSimulation === 'rain'
                ? 'bg-sky-600 text-white font-bold shadow-sm'
                : 'bg-slate-800/80 text-sky-300 hover:bg-sky-950/40 border border-sky-800/50'
            }`}
          >
            +14mm Cloudburst
          </button>

          <button
            onClick={() => onSimulate(22, 16)}
            className={`px-2.5 py-2 sm:py-1 rounded-lg text-xs font-semibold text-center transition-all ${
              activeSimulation === 'critical'
                ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/60'
            }`}
          >
            Critical Alert (&gt;50)
          </button>
        </div>
      </div>

    </div>
  );
};
