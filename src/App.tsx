import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StateLocationSelector } from './components/StateLocationSelector';
import { LiveWeatherRiskCard } from './components/LiveWeatherRiskCard';
import { RiskScorePanel } from './components/RiskScorePanel';
import { HighRiskWarningBanner } from './components/HighRiskWarningBanner';
import { SendAuthorityWarningModal } from './components/SendAuthorityWarningModal';
import { RealLeafletMap } from './components/RealLeafletMap';
import { CitizenSafetyTips } from './components/CitizenSafetyTips';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { HelplineModal } from './components/HelplineModal';
import { StatePreset, RealStationData, AiAnalysisResult } from './types';
import { generateLocalStationData, generateFallbackReport, STATE_PRESETS } from './data/landslideEngine';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export default function App() {
  const [states, setStates] = useState<StatePreset[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string>('sikkim');
  const [selectedCity, setSelectedCity] = useState<string>('Gangtok');
  const [stationData, setStationData] = useState<RealStationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Scenario Simulation state ('live' | 'tremor' | 'rain' | 'critical')
  const [activeSimulation, setActiveSimulation] = useState<string>('live');

  // Authority Warning Modal state
  const [isAuthorityModalOpen, setIsAuthorityModalOpen] = useState<boolean>(false);

  // AI Analysis states
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Helpline modal state
  const [isHelplineOpen, setIsHelplineOpen] = useState<boolean>(false);

  // 1. Fetch available states
  useEffect(() => {
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => {
        if (data.states && Array.isArray(data.states)) {
          setStates(data.states);
        }
      })
      .catch((err) => console.warn('Could not fetch states list:', err));
  }, []);

  // 2. Fetch live weather, tectonic vibrations & landslide risk
  const fetchLiveWeather = useCallback(async (
    city: string, 
    stateName?: string, 
    tremorGal: number = 0, 
    extraRain: number = 0
  ) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        city,
        ...(stateName && { state: stateName }),
        ...(tremorGal > 0 && { tremor: tremorGal.toString() }),
        ...(extraRain > 0 && { extraRain: extraRain.toString() }),
      });

      const res = await fetch(`/api/weather?${queryParams.toString()}`);
      if (res.ok) {
        const data: RealStationData = await res.json();
        setStationData(data);
      } else {
        const fallback = generateLocalStationData(city, stateName, tremorGal, extraRain);
        setStationData(fallback);
      }
    } catch (err) {
      console.warn('Network issue fetching live weather; using high-fidelity local matrix:', err);
      const fallback = generateLocalStationData(city, stateName, tremorGal, extraRain);
      setStationData(fallback);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount or when city/state changes (reset simulation to live)
  useEffect(() => {
    const activeState = states.find((s) => s.id === selectedStateId);
    setActiveSimulation('live');
    fetchLiveWeather(selectedCity, activeState?.name, 0, 0);
  }, [selectedCity, selectedStateId, states, fetchLiveWeather]);

  // Simulation handler (allows testing tectonic tremors, cloudbursts, or multi-disaster scenarios)
  const handleSimulate = (tremorGal: number, extraRain: number) => {
    let mode = 'live';
    if (tremorGal > 0 && extraRain > 0) mode = 'critical';
    else if (tremorGal > 0) mode = 'tremor';
    else if (extraRain > 0) mode = 'rain';

    setActiveSimulation(mode);
    const activeState = states.find((s) => s.id === selectedStateId);
    fetchLiveWeather(selectedCity, activeState?.name, tremorGal, extraRain);
  };

  // Handle State Switch
  const handleSelectState = (state: StatePreset) => {
    setSelectedStateId(state.id);
    setSelectedCity(state.defaultCity);
    setActiveSimulation('live');
    setAiAnalysis(null);
  };

  // Handle City Switch
  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setActiveSimulation('live');
    setAiAnalysis(null);
  };

  // Handle City / District Search
  const handleSearchCity = (query: string) => {
    setSelectedCity(query);
    setActiveSimulation('live');
    setAiAnalysis(null);
  };

  // Handle AI Analysis Fetch
  const handleTriggerAiAnalysis = async () => {
    if (!stationData) return;
    setIsAiModalOpen(true);

    if (aiAnalysis && aiAnalysis.city.toLowerCase() === stationData.city.toLowerCase()) {
      return;
    }

    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: stationData.city,
          state: stationData.state,
          country: stationData.location.country || 'India',
          lat: stationData.location.lat,
          lon: stationData.location.lon,
          elevationMeters: stationData.elevationMeters,
          localtime: stationData.location.localtime,
          observationTime: stationData.weather.observation_time,
          temperature: stationData.weather.temperature,
          feelslike: stationData.weather.feelslike,
          precip: stationData.weather.precip,
          humidity: stationData.weather.humidity,
          windSpeed: stationData.weather.wind_speed,
          windDir: stationData.weather.wind_dir,
          pressure: stationData.weather.pressure,
          visibility: stationData.weather.visibility,
          cloudcover: stationData.weather.cloudcover,
          weatherDesc: stationData.weather.weather_descriptions?.[0] || 'Overcast',
          riskLevel: stationData.risk.level,
          riskScore: stationData.risk.score,
          scoreBreakdown: stationData.risk.scoreBreakdown,
          tectonicFault: stationData.risk.tectonicData.faultLine,
          seismicZone: stationData.risk.tectonicData.seismicZone,
          tremorStatus: stationData.risk.tectonicData.tremorStatus,
          plateMovementRate: stationData.risk.tectonicData.plateMovementRate,
          vibrationGal: stationData.risk.tectonicData.vibrationGal,
          terrainDescription: stationData.terrainDescription,
        }),
      });

      if (res.ok) {
        const data: AiAnalysisResult = await res.json();
        setAiAnalysis(data);
      } else {
        const fallback = generateFallbackReport({
          city: stationData.city,
          state: stationData.state,
          riskScore: stationData.risk.score,
          vibrationGal: stationData.risk.tectonicData.vibrationGal,
          tectonicFault: stationData.risk.tectonicData.faultLine,
          precip: stationData.weather.precip,
          humidity: stationData.weather.humidity,
          temperature: stationData.weather.temperature,
          stationData,
        });
        setAiAnalysis(fallback);
      }
    } catch (err) {
      console.warn('AI analysis request failed, displaying geotechnical fallback dossier:', err);
      const fallback = generateFallbackReport({
        city: stationData.city,
        state: stationData.state,
        riskScore: stationData.risk.score,
        vibrationGal: stationData.risk.tectonicData.vibrationGal,
        tectonicFault: stationData.risk.tectonicData.faultLine,
        precip: stationData.weather.precip,
        humidity: stationData.weather.humidity,
        temperature: stationData.weather.temperature,
        stationData,
      });
      setAiAnalysis(fallback);
    } finally {
      setIsAiLoading(false);
    }
  };

  const activeState = states.find((s) => s.id === selectedStateId);
  const currentStateName = activeState?.name || stationData?.state || 'Hilly Region';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Clean Navigation Bar */}
      <Navbar
        currentCity={selectedCity}
        currentState={currentStateName}
        onRefresh={() => fetchLiveWeather(selectedCity, currentStateName)}
        isLoading={isLoading}
        onOpenHelpline={() => setIsHelplineOpen(true)}
        onOpenAiAnalysis={handleTriggerAiAnalysis}
      />

      {/* 2. Main Responsive Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5">
        
        {/* State & City Switcher + Instant Indian City Search */}
        <StateLocationSelector
          states={states}
          selectedStateId={selectedStateId}
          selectedCity={selectedCity}
          onSelectState={handleSelectState}
          onSelectCity={handleSelectCity}
          onSearchCity={handleSearchCity}
          isLoading={isLoading}
        />

        {/* HIGH RISK WARNING BANNER: Triggers when Risk Score > 50 */}
        {stationData && (stationData.risk.isWarningActive || stationData.risk.score > 50) && (
          <HighRiskWarningBanner
            data={stationData}
            onOpenAuthorityModal={() => setIsAuthorityModalOpen(true)}
            onOpenHelplines={() => setIsHelplineOpen(true)}
          />
        )}

        {/* 1-100 COMPOSITE RISK SCORE PANEL (Rainfall + Tectonic Plate Movements + Vibrations) */}
        {stationData && (
          <RiskScorePanel
            data={stationData}
            onOpenAuthorityModal={() => setIsAuthorityModalOpen(true)}
            onSimulate={handleSimulate}
            activeSimulation={activeSimulation}
          />
        )}

        {/* Live Weather & Landslide Threat Overview */}
        {stationData ? (
          <LiveWeatherRiskCard
            data={stationData}
            onOpenAiAnalysis={handleTriggerAiAnalysis}
            isAiLoading={isAiLoading}
          />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center min-h-[240px] text-center">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-200">
              Retrieving live meteorological &amp; seismic observations...
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Calculating 1-100 landslide risk score for {selectedCity}
            </p>
          </div>
        )}

        {/* Real OpenStreetMap Map (Leaflet) */}
        {stationData && (
          <RealLeafletMap station={stationData} />
        )}

        {/* Practical Mountain Safety Tips */}
        <CitizenSafetyTips />

      </main>

      {/* 3. Send Warning to Authorities Modal */}
      {stationData && (
        <SendAuthorityWarningModal
          isOpen={isAuthorityModalOpen}
          onClose={() => setIsAuthorityModalOpen(false)}
          data={stationData}
        />
      )}

      {/* 4. AI Analysis Modal */}
      <AiAnalysisModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        analysis={aiAnalysis}
        isLoading={isAiLoading}
        city={stationData?.city || selectedCity}
        state={stationData?.state || currentStateName}
        stationData={stationData}
      />

      {/* 5. Emergency Helpline Modal */}
      <HelplineModal
        isOpen={isHelplineOpen}
        onClose={() => setIsHelplineOpen(false)}
        currentState={currentStateName}
      />

      {/* 6. Clean, Professional Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">
              Himalayan &amp; Western Ghats Landslide Early Warning System
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-500 text-[11px]">
            <span>1-100 Risk Score Engine</span>
            <span>·</span>
            <span>Tectonic &amp; Seismic Telemetry</span>
            <span>·</span>
            <span>Weatherstack Live Precipitation</span>
            <span>·</span>
            <span>NDRF &amp; SDMA Authority Dispatch</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
