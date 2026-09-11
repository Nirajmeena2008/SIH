export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface LocationData {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  localtime: string;
}

export interface CurrentWeather {
  temperature: number;
  feelslike: number;
  weather_descriptions: string[];
  weather_icons: string[];
  precip: number; // rainfall in mm
  humidity: number; // %
  wind_speed: number; // km/h
  wind_dir: string;
  pressure: number; // mb
  cloudcover: number; // %
  uv_index: number;
  visibility: number; // km
  is_day: string;
  observation_time: string;
}

export interface TectonicSeismicData {
  faultLine: string;
  seismicZone: string;
  plateMovementRate: string;
  vibrationGal: number; // Ground vibration PGA in Gal (cm/s²)
  tremorStatus: 'QUIET' | 'MICRO_TREMOR' | 'ACTIVE_SEISMIC';
  historicalEarthquakes: string;
}

export interface RiskScoreBreakdown {
  rainfallPoints: number; // out of 45
  tectonicPoints: number; // out of 35
  slopePoints: number; // out of 20
  totalScore: number; // 1 - 100
}

export interface EvacuationPlan {
  assemblyPoint: string;
  evacuationRoutes: string[];
  bufferDistanceMeters: number;
  safeShelterName: string;
  checklist: string[];
}

export interface AuthorityWarningPayload {
  alertId: string;
  targetAgencies: string[];
  recommendedAction: string;
  priority: 'CRITICAL_EVACUATION' | 'ELEVATED_WARNING' | 'STANDARD_WATCH';
  dispatchedAt: string;
}

export interface LandslideRiskAssessment {
  level: RiskLevel;
  score: number; // 1 - 100
  isWarningActive: boolean; // True if score > 50
  statusTitle: string;
  summary: string;
  badgeClass: string;
  colorHex: string;
  scoreBreakdown: RiskScoreBreakdown;
  tectonicData: TectonicSeismicData;
  evacuationPlan: EvacuationPlan;
  authorityWarning: AuthorityWarningPayload;
  howToStaySafe: string[];
  precautions: string[];
}

export interface RealStationData {
  id: string;
  city: string;
  state: string;
  location: LocationData;
  weather: CurrentWeather;
  risk: LandslideRiskAssessment;
  isLiveWeatherstack: boolean;
  elevationMeters?: number;
  terrainDescription?: string;
}

export type WeatherStationData = RealStationData;

export interface StatePreset {
  id: string;
  name: string;
  defaultCity: string;
  cities: string[];
  terrain: string;
  riskProfile: string;
}

export interface LocationTelemetryReport {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  observationTime: string;
  localTime: string;
  temperature: number;
  feelsLike: number;
  weatherDescription: string;
  precipitationMm: number;
  humidityPercent: number;
  windSpeedKmh: number;
  windDirection: string;
  pressureMb: number;
  visibilityKm: number;
  cloudCoverPercent: number;
  vibrationGal: number;
  faultLine: string;
  seismicZone: string;
  tremorStatus: string;
  plateConvergenceRate: string;
  riskScore: number;
  riskLevel: RiskLevel;
  scoreBreakdown: {
    rainfallPoints: number;
    tectonicPoints: number;
    slopePoints: number;
    totalScore: number;
  };
}

export interface GeologicalAiExplanation {
  soilSaturationMechanics: string;
  tectonicShearStress: string;
  slopeTerrainVulnerability: string;
  overallSynthesis: string;
  criticalRiskFactors: string[];
  prognosisNext12Hours: string;
}

export interface CriticalActionGuide {
  isCritical: boolean;
  urgencyLevel: 'CRITICAL_IMMEDIATE_ACTION' | 'HIGH_ALERT_PREPARATION' | 'MODERATE_WATCH';
  statusHeading: string;
  immediateActions: string[];
  evacuationRoutesProtocol: string;
  sensoryWarningSigns: string[];
  safeAssemblyZone: string;
  essentialGoBagChecklist: string[];
  authoritiesToNotify: { agency: string; contact: string; role: string }[];
}

export interface AiAnalysisResult {
  city: string;
  state: string;
  title: string;
  situationSummary: string;
  travelSafetyStatus: string;
  telemetrySnapshot?: LocationTelemetryReport;
  telemetryReport?: LocationTelemetryReport;
  geologicalExplanation?: GeologicalAiExplanation;
  criticalGuide?: CriticalActionGuide;
  evacuationAndSurvivalGuide?: any;
  keyPrecautions: string[];
  emergencyHelplines: { name: string; number: string }[];
  lastUpdated: string;
  generatedByModel?: string;
}
