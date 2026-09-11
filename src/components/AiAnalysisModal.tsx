import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  CloudRain, 
  Droplets, 
  Activity, 
  Wind, 
  Gauge, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  PhoneCall, 
  Layers, 
  Mountain, 
  Radio, 
  FileText,
  AlertCircle,
  Eye,
  Shield,
  LifeBuoy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AiAnalysisResult, RealStationData } from '../types';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AiAnalysisResult | null;
  isLoading: boolean;
  city: string;
  state: string;
  stationData?: RealStationData | null;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  isLoading,
  city,
  state,
  stationData,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry' | 'geology' | 'critical' | 'precautions' | 'contacts'>('overview');
  
  // Options sideways scrolling state & ref
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll boundary to enable/disable left and right options scroll buttons
  const checkScroll = useCallback(() => {
    const el = tabsContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 6);
      setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
    }
  }, []);

  // Sideways scroll function for the options buttons
  const scrollTabs = (direction: 'left' | 'right') => {
    const el = tabsContainerRef.current;
    if (el) {
      const scrollDistance = 220;
      el.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 280);
    }
  };

  useEffect(() => {
    const el = tabsContainerRef.current;
    if (!el || !isOpen) return;

    checkScroll();

    // Wheel event to scroll sideways on the options bar
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        checkScroll();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', checkScroll);
    };
  }, [isOpen, checkScroll]);

  if (!isOpen) return null;

  // Derive consolidated telemetry values from either analysis snapshot or active stationData
  const snap = analysis?.telemetrySnapshot;
  const targetCity = snap?.city || stationData?.city || city;
  const targetState = snap?.state || stationData?.state || state;
  const targetCountry = snap?.country || stationData?.location.country || 'India';
  const targetLat = snap?.latitude ?? stationData?.location.lat ?? 27.33;
  const targetLon = snap?.longitude ?? stationData?.location.lon ?? 88.62;
  const targetElevation = snap?.elevationMeters ?? stationData?.elevationMeters ?? 1650;
  const targetObsTime = snap?.observationTime || stationData?.weather.observation_time || 'Recent';
  const targetLocalTime = snap?.localTime || stationData?.location.localtime || 'Live';

  const targetTemp = snap?.temperature ?? stationData?.weather.temperature ?? 18;
  const targetFeelsLike = snap?.feelsLike ?? stationData?.weather.feelslike ?? targetTemp;
  const targetPrecip = snap?.precipitationMm ?? stationData?.weather.precip ?? 0;
  const targetHumidity = snap?.humidityPercent ?? stationData?.weather.humidity ?? 80;
  const targetWindSpeed = snap?.windSpeedKmh ?? stationData?.weather.wind_speed ?? 12;
  const targetWindDir = snap?.windDirection || stationData?.weather.wind_dir || 'ENE';
  const targetPressure = snap?.pressureMb ?? stationData?.weather.pressure ?? 1012;
  const targetVisibility = snap?.visibilityKm ?? stationData?.weather.visibility ?? 6;
  const targetCloudCover = snap?.cloudCoverPercent ?? stationData?.weather.cloudcover ?? 75;
  const targetDesc = snap?.weatherDescription || stationData?.weather.weather_descriptions?.[0] || 'Overcast';

  const targetScore = snap?.riskScore ?? stationData?.risk.score ?? 45;
  const targetLevel = snap?.riskLevel || stationData?.risk.level || (targetScore > 50 ? 'HIGH' : 'MODERATE');
  const targetRainPoints = snap?.scoreBreakdown?.rainfallPoints ?? stationData?.risk.scoreBreakdown?.rainfallPoints ?? Math.round((targetPrecip / 35) * 45);
  const targetTectonicPoints = snap?.scoreBreakdown?.tectonicPoints ?? stationData?.risk.scoreBreakdown?.tectonicPoints ?? Math.round(targetScore * 0.35);
  const targetSlopePoints = snap?.scoreBreakdown?.slopePoints ?? stationData?.risk.scoreBreakdown?.slopePoints ?? 14;

  const targetFault = snap?.faultLine || stationData?.risk.tectonicData.faultLine || 'Main Boundary Thrust (MBT)';
  const targetSeismicZone = snap?.seismicZone || stationData?.risk.tectonicData.seismicZone || 'Zone IV';
  const targetTremorStatus = snap?.tremorStatus || stationData?.risk.tectonicData.tremorStatus || (targetScore > 50 ? 'ACTIVE_SEISMIC' : 'MICRO_TREMOR');
  const targetPlateRate = snap?.plateConvergenceRate || stationData?.risk.tectonicData.plateMovementRate || '~48 mm/year (Indo-Eurasian Convergence)';
  const targetVib = snap?.vibrationGal ?? stationData?.risk.tectonicData.vibrationGal ?? 5.4;

  const isCritical = analysis?.criticalGuide?.isCritical ?? (targetScore > 50 || targetLevel === 'HIGH' || targetLevel === 'CRITICAL');
  const guide = analysis?.criticalGuide;
  const geology = analysis?.geologicalExplanation;

  const handleCopyFullReport = () => {
    const reportText = `=====================================================
LANDSLIDE RISK & TELEMETRY DOSSIER: ${targetCity.toUpperCase()}, ${targetState.toUpperCase()}
Generated: ${analysis?.lastUpdated || new Date().toLocaleString()}
Engine: ${analysis?.generatedByModel || 'Gemini 3.8 Flash Deep Geotechnical Model'}
=====================================================

1. EXECUTIVE RISK SUMMARY:
- Composite Landslide Risk Score: ${targetScore}/100 [Level: ${targetLevel}]
- Critical Status: ${isCritical ? 'ALERT EXCEEDS 50 - EVACUATION ADVISORY ACTIVE' : 'MONITORING - WITHIN TOLERANCE'}
- Travel Safety Status: ${analysis?.travelSafetyStatus || 'Drive with caution.'}
- Situation Summary: ${analysis?.situationSummary || ''}

2. COMPLETE READING LOCATION & TELEMETRY:
- Location: ${targetCity}, ${targetState}, ${targetCountry}
- Coordinates: ${targetLat}°N, ${targetLon}°E | Elevation: ~${targetElevation}m ASL
- Observation Time: ${targetObsTime} (Local: ${targetLocalTime})
- Temperature: ${targetTemp}°C (Feels like: ${targetFeelsLike}°C) | ${targetDesc}
- Rainfall Precipitation: ${targetPrecip} mm/hr (Contributes ${targetRainPoints}/45 to risk score)
- Relative Humidity: ${targetHumidity}% | Barometric Pressure: ${targetPressure} mb
- Wind: ${targetWindSpeed} km/h (${targetWindDir}) | Visibility: ${targetVisibility} km | Cloud Cover: ${targetCloudCover}%
- Tectonic Fault Line: ${targetFault}
- Seismic Hazard Zone: ${targetSeismicZone}
- Peak Ground Acceleration (PGA): ${targetVib} Gal | Tremor Status: ${targetTremorStatus}
- Plate Convergence Rate: ${targetPlateRate}

3. IN-DEPTH GEOLOGICAL & PHYSICAL EXPLANATION:
- Soil Saturation Mechanics: ${geology?.soilSaturationMechanics || 'Elevated moisture increases pore water pressure along shear planes.'}
- Tectonic & Micro-Seismic Shear Dynamics: ${geology?.tectonicShearStress || 'Seismic accelerations degrade bedrock cohesion.'}
- Slope Geometry & Topographic Vulnerability: ${geology?.slopeTerrainVulnerability || 'Steep colluvial slope gradient.'}
- Overall Synthesis: ${geology?.overallSynthesis || ''}
- 12-Hour Prognosis: ${geology?.prognosisNext12Hours || ''}

4. CRITICAL ACTION & EVACUATION PROTOCOL:
- Status: ${guide?.statusHeading || (isCritical ? 'CRITICAL EVACUATION DIRECTIVE' : 'STANDARD ADVISORY')}
- Evacuation Routes Rule: ${guide?.evacuationRoutesProtocol || 'Move perpendicular to slide chutes, gain ridge elevation.'}
- Immediate Actions:
${(guide?.immediateActions || analysis?.keyPrecautions || []).map((a, i) => `  ${i + 1}. ${a}`).join('\n')}
- Sensory Warning Signs:
${(guide?.sensoryWarningSigns || []).map((s) => `  * ${s}`).join('\n')}
- Safe Muster Zone: ${guide?.safeAssemblyZone || 'Designated concrete municipal shelters on high ridge.'}

5. EMERGENCY CONTACTS:
- National Emergency: 112
- State Disaster Management: 1077
- National Highway Assistance: 1033
=====================================================`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-hidden">
      <div 
        className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[94vh] max-h-[94vh]"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 sm:py-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight truncate">
                  AI Landslide Analysis &amp; Telemetry Dossier
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                  <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 text-slate-800 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {targetCity}, {targetState}
                </span>
                <span>•</span>
                <span>{targetLat.toFixed(2)}°N, {targetLon.toFixed(2)}°E</span>
                <span>•</span>
                <span>~{targetElevation}m ASL</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyFullReport}
              disabled={isLoading || !analysis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors disabled:opacity-50 shadow-xs"
              title="Copy comprehensive text dossier to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Copy Dossier</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options Row with Sideways Scroll Functions & Hidden Scrollbars */}
        <div className="relative bg-slate-50 border-b border-slate-200 flex items-center shrink-0 px-2 sm:px-3 py-1.5">
          
          {/* Scroll Options Left Button */}
          <button
            type="button"
            onClick={() => scrollTabs('left')}
            disabled={!canScrollLeft}
            title="Scroll options left"
            aria-label="Scroll options to the left"
            className={`p-1.5 rounded-lg transition-all shrink-0 mr-1.5 flex items-center justify-center ${
              canScrollLeft
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs cursor-pointer active:scale-95'
                : 'text-slate-300 bg-slate-100/60 border border-slate-200/60 opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Left shadow fade cue */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-8 sm:left-10 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          )}

          {/* Options Container: Hidden scrollbars with smooth sideways scrolling */}
          <div
            ref={tabsContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1 text-xs select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 shadow-xs'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Overview &amp; Road Status</span>
            </button>

            <button
              onClick={() => setActiveTab('critical')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                isCritical
                  ? activeTab === 'critical'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-rose-700 bg-rose-50 border border-rose-200 font-bold'
                  : activeTab === 'critical'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 shadow-xs'
              }`}
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-600' : ''}`} />
              <span>Critical Guide &amp; Evacuation</span>
              {isCritical && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                  ALERT
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'telemetry'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 shadow-xs'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Reading Location Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('geology')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'geology'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 shadow-xs'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>AI Geological Explanation</span>
            </button>

            <button
              onClick={() => setActiveTab('precautions')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'precautions'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 shadow-xs'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safety &amp; Go-Bag Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'contacts'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 shadow-xs'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>Emergency Contacts &amp; Helplines</span>
            </button>
          </div>

          {/* Right shadow fade cue */}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-8 sm:right-10 top-0 bottom-0 w-4 bg-gradient-to-l from-slate-50 to-transparent z-10" />
          )}

          {/* Scroll Options Right Button */}
          <button
            type="button"
            onClick={() => scrollTabs('right')}
            disabled={!canScrollRight}
            title="Scroll options right"
            aria-label="Scroll options to the right"
            className={`p-1.5 rounded-lg transition-all shrink-0 ml-1.5 flex items-center justify-center ${
              canScrollRight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs cursor-pointer active:scale-95'
                : 'text-slate-300 bg-slate-100/60 border border-slate-200/60 opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content Body with NO side scrollbars */}
        <div 
          className="p-4 sm:p-6 overflow-y-auto no-scrollbar space-y-6 flex-1 bg-white"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
              <p className="text-base font-bold text-slate-900">
                Generating Detailed Geotechnical Dossier &amp; AI Analysis...
              </p>
              <p className="text-xs text-slate-500 max-w-md">
                Analyzing real-time weather readings, soil saturation kinetics, tectonic micro-vibrations, and slope stability vectors for {targetCity}.
              </p>
            </div>
          ) : (
            <>
              {/* CRITICAL WARNING BANNER: If risk score > 50 or isCritical is true */}
              {isCritical && (
                <div className="p-4 sm:p-5 rounded-xl bg-rose-50 border-2 border-rose-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0 shadow-xs">
                        <ShieldAlert className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white">
                            {guide?.urgencyLevel === 'CRITICAL_IMMEDIATE_ACTION' ? 'CRITICAL EMERGENCY' : 'HIGH ALERT'}
                          </span>
                          <span className="text-xs font-bold text-rose-700">
                            Threshold &gt; 50 Exceeded
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-rose-950 mt-1">
                          {guide?.statusHeading || `Critical Landslide Risk in ${targetCity}`}
                        </h4>
                        <p className="text-xs sm:text-sm text-rose-900/90 mt-0.5 leading-relaxed">
                          Composite risk score reached <strong className="text-rose-950 font-mono font-bold">{targetScore}/100</strong>. Soil pore saturation and seismic accelerations indicate heightened vulnerability to mudflows and slope failure.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <button
                        onClick={() => setActiveTab('critical')}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <LifeBuoy className="w-4 h-4" />
                        <span>View Evacuation Guide</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: OVERVIEW & ROAD STATUS */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  {/* Top Score & Quick Snapshot */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Score Card */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Landslide Risk Score
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className={`text-3xl font-extrabold font-mono ${
                            targetScore > 50 ? 'text-rose-700' : targetScore >= 25 ? 'text-amber-700' : 'text-emerald-700'
                          }`}>
                            {targetScore}
                          </span>
                          <span className="text-xs text-slate-500">/ 100</span>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          targetScore > 50 ? 'text-rose-700' : targetScore >= 25 ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                          {targetLevel} Vulnerability
                        </span>
                      </div>
                      <div className={`p-3 rounded-xl border ${
                        targetScore > 50 
                          ? 'bg-rose-50 border-rose-200 text-rose-700' 
                          : targetScore >= 25
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        {targetScore > 50 ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                      </div>
                    </div>

                    {/* Rainfall Contribution */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Rainfall Infiltration
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-bold font-mono text-slate-900">
                            {targetPrecip} <span className="text-xs font-normal text-slate-500">mm/hr</span>
                          </span>
                        </div>
                        <span className="text-xs text-sky-700 font-bold">
                          {targetRainPoints} / 45 Risk Points
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-700">
                        <CloudRain className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Tectonic Vibration */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Seismic Vibration (PGA)
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-bold font-mono text-slate-900">
                            {targetVib} <span className="text-xs font-normal text-slate-500">Gal</span>
                          </span>
                        </div>
                        <span className="text-xs text-amber-700 font-bold">
                          {targetTectonicPoints} / 35 Risk Points
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                        <Activity className="w-6 h-6" />
                      </div>
                    </div>

                  </div>

                  {/* Situation Summary */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Executive Situation Summary</span>
                    </h4>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed space-y-2 shadow-xs">
                      <p>{analysis?.situationSummary}</p>
                    </div>
                  </div>

                  {/* Road & Travel Safety Guidance */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Mountain Road &amp; Travel Safety Status</span>
                    </h4>
                    <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-xs ${
                      isCritical
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}>
                      {isCritical ? (
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-bold">
                          {analysis?.travelSafetyStatus}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Evaluated against National Highway guidelines, ghat road geometry, and current slope saturation vectors.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Precautions Checklist */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Immediate Safety Precautions</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(analysis?.keyPrecautions || [
                        "Avoid parking or lingering under steep roadside rock cuts.",
                        "Maintain lower driving speeds with headlights on around ghat curves.",
                        "Monitor local SDMA bulletins and emergency weather broadcasts.",
                        "Report tension cracks or mud flows on mountain roads to 1077.",
                      ]).map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 shadow-xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Helplines Quick Access */}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                        <span>Emergency Assistance Helplines</span>
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">24/7 Toll-Free Dispatch</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(analysis?.emergencyHelplines || [
                        { name: 'National Emergency', number: '112' },
                        { name: 'District Disaster', number: '1077' },
                        { name: 'Highways Assistance', number: '1033' },
                        { name: 'Ambulance Emergency', number: '108' },
                      ]).map((h, i) => (
                        <a
                          key={i}
                          href={`tel:${h.number}`}
                          className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all text-center group shadow-xs"
                        >
                          <span className="text-[10px] text-slate-500 font-medium block truncate">{h.name}</span>
                          <span className="text-base font-extrabold text-rose-700 group-hover:text-rose-800 font-mono">
                            {h.number}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CRITICAL ACTION & EVACUATION GUIDE */}
              {activeTab === 'critical' && (
                <div className="space-y-6">
                  
                  {/* Status Directive Banner */}
                  <div className={`p-4 rounded-xl border shadow-xs ${
                    isCritical
                      ? 'bg-rose-50 border-rose-200 text-rose-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        isCritical ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700 border border-slate-300'
                      }`}>
                        {guide?.urgencyLevel || (isCritical ? 'CRITICAL_IMMEDIATE_ACTION' : 'PREPAREDNESS_PROTOCOL')}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Target Site: {targetCity}, {targetState}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">
                      {guide?.statusHeading || `Emergency Action Protocol: ${targetCity}`}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      This operational guide is activated whenever the multi-factor Landslide Risk Score breaches safe thresholds or when terrain saturation reaches critical limits.
                    </p>
                  </div>

                  {/* 1. Immediate Survival Actions */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <LifeBuoy className="w-3.5 h-3.5 text-rose-600" />
                      <span>1. Immediate Action Directives</span>
                    </h4>
                    <div className="space-y-2">
                      {(guide?.immediateActions || [
                        "Immediately evacuate hillside dwellings, drainage gullies, and riverbanks to designated high-ridge municipal shelters.",
                        "Shut off main residential electrical breakers and gas/LPG valves before departing.",
                        "Stay off all ghat roads, mountain highways, and bridges spanning swollen mountain torrents.",
                        "Alert immediate neighbors, vulnerable elderly residents, and sound local whistle/horn alarms.",
                      ]).map((action, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs"
                        >
                          <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 border border-rose-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                            {action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Topographical Evacuation Route Protocol */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-sky-700" />
                      <span>2. Topographical Evacuation Route Protocol</span>
                    </h4>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
                      <div className="flex items-start gap-2.5 text-sky-900">
                        <AlertCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm font-semibold">
                          {guide?.evacuationRoutesProtocol || "CRITICAL ESCAPE RULE: Never flee down a valley, stream canyon, or natural drainage chute. Always move PERPENDICULAR to the slide vector, gaining elevation onto broad, bedrock-anchored ridges."}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                          <span className="font-bold text-emerald-700 block mb-0.5">DO MOVE TOWARDS:</span>
                          Broad convex ridges, stable bedrock spurs, designated elevated municipal stadiums.
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                          <span className="font-bold text-rose-700 block mb-0.5">DO NOT MOVE TOWARDS:</span>
                          Stream beds, ravine floors, hollows, or directly beneath excavated road cuts.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Sensory Warning Signs of Imminent Failure */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>3. Physical &amp; Sensory Warning Signs to Watch For</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(guide?.sensoryWarningSigns || [
                        "New tension fractures appearing in paved roads, stone retaining walls, or home masonry.",
                        "Trees, fence posts, or utility poles suddenly tilting uphill or downhill.",
                        "Clear mountain springs or runoff streams turning abruptly muddy or drying up without explanation.",
                        "Deep subterranean rumbling, popping noises, or cracking tree trunks echoing through the valley.",
                      ]).map((sign, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-xs"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{sign}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Go-Bag & Survival Checklist */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-700" />
                      <span>4. Rapid Evacuation &ldquo;Go-Bag&rdquo; Checklist</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(guide?.essentialGoBagChecklist || [
                        "Potable drinking water (3 liters per person minimum) & purification tablets",
                        "High-calorie non-perishable rations (energy bars, dry fruit, biscuits)",
                        "Waterproof LED headlamp/torch with spare batteries & high-decibel whistle",
                        "Compact first-aid kit with personal prescription medicines & antiseptic wipes",
                        "Government ID cards, property papers, and cash sealed in waterproof ziplock bags",
                        "Foil emergency survival thermal blanket and durable rain poncho",
                      ]).map((item, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. Safe Assembly Muster Zone */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 shadow-xs">
                    <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                        Recommended Safe Assembly Zone
                      </span>
                      <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
                        {guide?.safeAssemblyZone || `Designated concrete municipal stadium, SDMA civil relief center, or high ridge vantage points above ${targetElevation + 50}m ASL.`}
                      </p>
                    </div>
                  </div>

                  {/* 6. Authoritative Contacts to Notify */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                      <span>5. Emergency Authorities to Notify</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(guide?.authoritiesToNotify || [
                        { agency: "National Emergency Helpline", contact: "112", role: "Unified Police, Fire & First Responder Dispatch" },
                        { agency: "State Disaster Management (SDMA)", contact: "1070 / 1077", role: "District Emergency Operations Center" },
                        { agency: "NDRF Operations Room", contact: "011-24363260", role: "National Search & Mountain Rescue Battalion" },
                        { agency: "National Highways Emergency", contact: "1033", role: "Road Clearance & Heavy Debris Removal" },
                      ]).map((auth, idx) => (
                        <div 
                          key={idx}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 shadow-xs"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{auth.agency}</span>
                            <span className="text-[11px] text-slate-500 block">{auth.role}</span>
                          </div>
                          <a 
                            href={`tel:${auth.contact.replace(/\s+/g, '')}`}
                            className="px-2.5 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-mono font-bold text-xs shrink-0 transition-colors"
                          >
                            {auth.contact}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: COMPLETE READING LOCATION TELEMETRY */}
              {activeTab === 'telemetry' && (
                <div className="space-y-5">
                  
                  {/* Location Header Strip */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Reading Location Station Dossier
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span>{targetCity}, {targetState}</span>
                        <span className="text-xs font-normal text-slate-500">({targetCountry})</span>
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-sky-700 shadow-xs">
                        GPS: {targetLat.toFixed(4)}°N, {targetLon.toFixed(4)}°E
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-emerald-700 shadow-xs">
                        Elev: {targetElevation}m ASL
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 shadow-xs">
                        Obs: {targetObsTime}
                      </span>
                    </div>
                  </div>

                  {/* 1. Meteorological Sensor Suite Readings */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <CloudRain className="w-3.5 h-3.5 text-sky-700" />
                      <span>Live Atmospheric &amp; Weather Readings</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Rainfall Rate</span>
                        <span className="text-lg font-bold text-slate-900 font-mono">{targetPrecip}</span>
                        <span className="text-xs text-slate-500 ml-1">mm/hr</span>
                        <span className="text-[10px] text-sky-700 font-bold block mt-0.5">{targetRainPoints}/45 score</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Relative Humidity</span>
                        <span className="text-lg font-bold text-slate-900 font-mono">{targetHumidity}</span>
                        <span className="text-xs text-slate-500 ml-1">%</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Atmospheric sat.</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Temperature</span>
                        <span className="text-lg font-bold text-slate-900 font-mono">{targetTemp}°C</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Feels {targetFeelsLike}°C</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Barometric Pressure</span>
                        <span className="text-lg font-bold text-slate-900 font-mono">{targetPressure}</span>
                        <span className="text-xs text-slate-500 ml-1">mb</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Surface gradient</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Wind Velocity</span>
                        <span className="text-lg font-bold text-slate-900 font-mono">{targetWindSpeed}</span>
                        <span className="text-xs text-slate-500 ml-1">km/h ({targetWindDir})</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Visibility</span>
                        <span className="text-lg font-bold text-slate-900 font-mono">{targetVisibility}</span>
                        <span className="text-xs text-slate-500 ml-1">km</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Cloud Cover</span>
                        <span className="text-lg font-bold text-slate-900 font-mono">{targetCloudCover}</span>
                        <span className="text-xs text-slate-500 ml-1">%</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Sky Condition</span>
                        <span className="text-sm font-bold text-slate-900 capitalize truncate block mt-1">{targetDesc}</span>
                      </div>

                    </div>
                  </div>

                  {/* 2. Seismological & Tectonic Sensor Readings */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-amber-600" />
                      <span>Seismological &amp; Tectonic Readings</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">Active Fault System</span>
                        <p className="text-sm font-bold text-slate-900">{targetFault}</p>
                        <p className="text-xs text-slate-500">Major Himalayan crustal discontinuity corridor</p>
                      </div>

                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">Seismic Hazard Zone</span>
                        <p className="text-sm font-bold text-slate-900">{targetSeismicZone} (High to Very High Vulnerability)</p>
                        <p className="text-xs text-slate-500">Bureau of Indian Standards (IS 1893:2002)</p>
                      </div>

                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">Peak Ground Acceleration (PGA)</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold font-mono text-amber-700">{targetVib} Gal</span>
                          <span className="text-xs text-slate-500 font-mono">({(targetVib / 980).toFixed(4)} g)</span>
                        </div>
                        <p className="text-xs text-slate-500">Tremor Status: <strong className="text-slate-800 font-bold">{targetTremorStatus}</strong></p>
                      </div>

                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">Tectonic Convergence Velocity</span>
                        <p className="text-sm font-bold text-slate-900">{targetPlateRate}</p>
                        <p className="text-xs text-slate-500">GPS geodetic measurement of Indian Plate underthrusting</p>
                      </div>

                    </div>
                  </div>

                  {/* 3. Composite 1-100 Risk Score Decomposition */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Mathematical Score Breakdown (1-100)</span>
                    </h4>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-700 font-medium">Precipitation &amp; Moisture Factor (Max 45)</span>
                          <span className="font-mono font-bold text-sky-700">{targetRainPoints} / 45 pts</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-sky-600 h-2 rounded-full transition-all"
                            style={{ width: `${(targetRainPoints / 45) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-700 font-medium">Tectonic Micro-Vibration &amp; Fault Strain (Max 35)</span>
                          <span className="font-mono font-bold text-amber-700">{targetTectonicPoints} / 35 pts</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-amber-500 h-2 rounded-full transition-all"
                            style={{ width: `${(targetTectonicPoints / 35) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-700 font-medium">Slope Gradient &amp; Topographic Hazard (Max 20)</span>
                          <span className="font-mono font-bold text-emerald-700">{targetSlopePoints} / 20 pts</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full transition-all"
                            style={{ width: `${(targetSlopePoints / 20) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Total Composite Landslide Risk Score</span>
                        <span className="text-base font-extrabold font-mono text-slate-900">
                          {targetScore} / 100 ({targetLevel})
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: AI GEOLOGICAL EXPLANATION */}
              {activeTab === 'geology' && (
                <div className="space-y-5">
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-slate-50 to-emerald-50/40 border border-emerald-200 shadow-xs">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Senior Geotechnical &amp; Hydrological Analysis
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      Physical Mechanics of Slope Vulnerability in {targetCity}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Detailed assessment explaining how precipitation, ground accelerations, and bedrock morphology interact to determine slope shear strength.
                    </p>
                  </div>

                  {/* 1. Soil Saturation & Pore-Water Mechanics */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-sky-700" />
                      <span>1. Soil Saturation &amp; Pore-Water Pressure Mechanics</span>
                    </h4>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 shadow-xs">
                      <p>
                        {geology?.soilSaturationMechanics || `Heavy precipitation (${targetPrecip} mm/hr) coupled with ${targetHumidity}% humidity elevates the groundwater table within the unconsolidated colluvium mantle. As interstitial pore spaces fill with water, pore-water pressure rises rapidly, counteracting normal effective stress and reducing the frictional shear strength along the bedrock boundary.`}
                      </p>
                    </div>
                  </div>

                  {/* 2. Tectonic & Micro-Seismic Shear Stress */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-amber-600" />
                      <span>2. Tectonic Shear Stress &amp; Vibration Amplification</span>
                    </h4>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 shadow-xs">
                      <p>
                        {geology?.tectonicShearStress || `Ground acceleration measured at ${targetVib} Gal near the active ${targetFault} in ${targetSeismicZone} induces cyclic inertial loads across saturated slope cuts. Micro-seismic vibrations reduce cohesive bonding between weathered phyllite/schist bedrock layers, creating momentary liquefaction pockets that precipitate sudden rotational or translational slides.`}
                      </p>
                    </div>
                  </div>

                  {/* 3. Slope Terrain Vulnerability */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-emerald-700" />
                      <span>3. Slope Incline &amp; Topographic Vulnerability</span>
                    </h4>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 shadow-xs">
                      <p>
                        {geology?.slopeTerrainVulnerability || `At an altitude of ~${targetElevation}m ASL, steep hillside gradients (frequently exceeding 35°) with anthropogenic road cutting leave unsupported toe sections. Combined with colluvial gravel-soil overburden, the factor of safety (FoS) decreases whenever saturation coincides with micro-tremors.`}
                      </p>
                    </div>
                  </div>

                  {/* Critical Risk Drivers */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Key Physical Risk Drivers Identified by AI</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(geology?.criticalRiskFactors || [
                        `Rainfall accumulation rate: ${targetPrecip} mm/hr (${targetRainPoints}/45 threat points)`,
                        `Seismic vibration acceleration: ${targetVib} Gal in ${targetSeismicZone} (${targetTectonicPoints}/35 points)`,
                        `Steep colluvial slope gradient at ~${targetElevation}m altitude (${targetSlopePoints}/20 points)`,
                        `High relative humidity: ${targetHumidity}% with low barometric pressure (${targetPressure} mb)`,
                      ]).map((driver, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                          <span>{driver}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 12-Hour Forward-Looking Prognosis */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>12-Hour Stability Forecast &amp; Prognosis</span>
                    </h4>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-emerald-200 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
                      {geology?.prognosisNext12Hours || (
                        isCritical
                          ? "Elevated risk is projected to persist over the next 12-18 hours until cumulative rainfall subsides below 3 mm/hr and soil drainage stabilizes."
                          : "Slope stability is projected to remain moderate over the next 12 hours, barring sudden localized cloudburst activity exceeding 15 mm/hr."
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: PRECAUTIONS & EMERGENCY GO-BAG CHECKLIST */}
              {activeTab === 'precautions' && (
                <div className="space-y-6">
                  {/* Header summary */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Citizen Safety &amp; Preparedness Directives
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                      Immediate Safety Precautions &amp; Go-Bag Checklist
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Actionable protocols and essential survival provisions for residents and travelers in {targetCity}, {targetState}.
                    </p>
                  </div>

                  {/* Immediate Safety Precautions */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Immediate Safety Precautions</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(analysis?.keyPrecautions || [
                        "Avoid travelling along vulnerable landslide-prone highway corridors and ghat cuttings.",
                        "Clear residential roof drains and perimeter stormwater channels of silt and debris.",
                        "Inspect hillside retaining walls, slope toe masonry, and surface ground for newly forming cracks.",
                        "Charge mobile devices, flashlights, and backup power banks immediately.",
                        "Ensure family members and neighbors are briefed on high-ground evacuation assembly routes.",
                        "Keep emergency contacts (112, 1070) pre-programmed in phone speed dials."
                      ]).map((precaution, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700 shadow-xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{precaution}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rapid Evacuation "Go-Bag" Checklist */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Rapid Evacuation &ldquo;Go-Bag&rdquo; Essential Checklist</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(guide?.essentialGoBagChecklist || [
                        "Potable drinking water (3 liters per person minimum) & purification tablets",
                        "High-calorie non-perishable rations (energy bars, dry fruit, biscuits)",
                        "Waterproof LED headlamp/torch with spare batteries & high-decibel whistle",
                        "Compact first-aid kit with personal prescription medicines & antiseptic wipes",
                        "Government ID cards, property papers, and cash sealed in waterproof ziplock bags",
                        "Foil emergency survival thermal blanket and durable rain poncho",
                      ]).map((item, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sensory Warning Signs */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>Physical &amp; Sensory Failure Indicators to Watch</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(guide?.sensoryWarningSigns || [
                        "New tension fractures appearing in paved roads, stone retaining walls, or home masonry.",
                        "Trees, fence posts, or utility poles suddenly tilting uphill or downhill.",
                        "Clear mountain springs or runoff streams turning abruptly muddy or drying up without explanation.",
                        "Deep subterranean rumbling, popping noises, or cracking tree trunks echoing through the valley.",
                      ]).map((sign, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-xs"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{sign}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 6: EMERGENCY AUTHORITIES & DISASTER HELPLINES */}
              {activeTab === 'contacts' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Direct Emergency Response Dispatch
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                      Disaster Relief Helplines &amp; Authorities
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Official 24/7 disaster response helplines active for {targetCity}, {targetState}. Tap any contact to dial directly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { agency: "Unified National Emergency Service", contact: "112", role: "Integrated Police, Fire, Ambulance & SDRF dispatch across India" },
                      { agency: "State Disaster Management (SDMA)", contact: "1070", role: "State level Emergency Operations Centre & control room" },
                      { agency: "District Emergency Control (DEOC)", contact: "1077", role: "Local district collectorate & rapid relief team" },
                      { agency: "NDRF Operations HQ", contact: "011-24363260", role: "National Search & Mountain Rescue Battalion" },
                      { agency: "National Highways Helpline", contact: "1033", role: "Highway rescue, crane deployment & rockslide clearance" },
                      { agency: "Ambulance & Medical Emergency", contact: "108", role: "Mountain trauma response and emergency ambulance dispatch" }
                    ].map((auth, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors shadow-xs"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">{auth.agency}</span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">{auth.role}</span>
                        </div>
                        <a 
                          href={`tel:${auth.contact.replace(/\s+/g, '')}`}
                          className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-mono font-bold text-xs shrink-0 transition-all flex items-center gap-1.5"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{auth.contact}</span>
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Safe assembly zone */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 shadow-xs">
                    <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                        Designated Safe Muster &amp; Relief Shelter
                      </span>
                      <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                        {guide?.safeAssemblyZone || `Municipal Sports Stadium or concrete Community Centre situated on stable ridge spur at ~${targetElevation + 40}m ASL.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span>Model: {analysis?.generatedByModel || 'Gemini 3.8 Flash (AI Geotechnical)'}</span>
            <span>•</span>
            <span>Updated: {analysis?.lastUpdated || new Date().toLocaleTimeString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFullReport}
              disabled={isLoading || !analysis}
              className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'Copied' : 'Copy Full Dossier'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
