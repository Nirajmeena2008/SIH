import { 
  RealStationData, 
  StatePreset, 
  AiAnalysisResult, 
  RiskLevel 
} from "../types";

export interface StatePresetData extends StatePreset {}

export const STATE_PRESETS: StatePresetData[] = [
  {
    id: "sikkim",
    name: "Sikkim",
    defaultCity: "Gangtok",
    cities: ["Gangtok", "Namchi", "Mangan", "Pelling"],
    terrain: "Steep Himalayan ridges & river valleys (NH-10 corridor)",
    riskProfile: "High vulnerability during monsoon showers; fragile phyllite geology",
  },
  {
    id: "himachal-pradesh",
    name: "Himachal Pradesh",
    defaultCity: "Shimla",
    cities: ["Shimla", "Manali", "Dharamshala", "Kullu"],
    terrain: "Western Himalayan valleys, Beas & Sutlej river corridors",
    riskProfile: "Prone to cloudburst runoff and slope subsidence on NH-5 and NH-21",
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    defaultCity: "Dehradun",
    cities: ["Dehradun", "Nainital", "Mussoorie", "Joshimath"],
    terrain: "Garhwal & Kumaon Himalayas, Char Dham arterial routes",
    riskProfile: "High precipitation triggers debris flows on steep roadside cuts",
  },
  {
    id: "meghalaya",
    name: "Meghalaya",
    defaultCity: "Shillong",
    cities: ["Shillong", "Cherrapunji", "Tura", "Jowai"],
    terrain: "Shillong Plateau & heavy orographic rainfall escarpments",
    riskProfile: "Intense downpours cause rapid soil saturation on highway banks",
  },
  {
    id: "assam",
    name: "Assam",
    defaultCity: "Haflong",
    cities: ["Haflong", "Guwahati", "Silchar", "Diphu"],
    terrain: "Dima Hasao Hill section & Brahmaputra river valleys",
    riskProfile: "Shale strata prone to sliding near railway & highway links",
  },
  {
    id: "kerala",
    name: "Kerala",
    defaultCity: "Wayanad",
    cities: ["Wayanad", "Munnar", "Idukki", "Palakkad"],
    terrain: "Western Ghats mountain slopes & plantation hillocks",
    riskProfile: "Intense tropical monsoon rainfall causes localized debris slips",
  },
  {
    id: "west-bengal",
    name: "West Bengal (Hills)",
    defaultCity: "Darjeeling",
    cities: ["Darjeeling", "Kalimpong", "Kurseong", "Mirik"],
    terrain: "Eastern Himalayan foothills, Teesta river gorge",
    riskProfile: "Fragile slope soil with heavy tea garden surface water runoff",
  },
  {
    id: "jammu-kashmir",
    name: "Jammu & Kashmir",
    defaultCity: "Srinagar",
    cities: ["Srinagar", "Gulmarg", "Pahalgam", "Jammu"],
    terrain: "Pir Panjal range & Kashmir valley passes (NH-44 axis)",
    riskProfile: "Rain-induced shooting stones and mudslides along mountain passes",
  },
  {
    id: "arunachal-pradesh",
    name: "Arunachal Pradesh",
    defaultCity: "Tawang",
    cities: ["Tawang", "Itanagar", "Pasighat", "Bomdila"],
    terrain: "High alpine passes, BCT road network",
    riskProfile: "Permafrost freeze-thaw and heavy monsoon destabilization",
  },
  {
    id: "nagaland",
    name: "Nagaland",
    defaultCity: "Kohima",
    cities: ["Kohima", "Dimapur", "Mokokchung", "Wokha"],
    terrain: "Naga Hills ridgelines and NH-29 lifelines",
    riskProfile: "Argillite weathering causing frequent road blockages",
  },
  {
    id: "mizoram",
    name: "Mizoram",
    defaultCity: "Aizawl",
    cities: ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
    terrain: "North-South sandstone hill ridges & valleys",
    riskProfile: "Unconsolidated sandstone prone to roadside slope failure",
  },
];

export const KNOWN_COORDINATES: Record<string, { lat: number; lon: number; state: string; elevation: number }> = {
  Gangtok: { lat: 27.3389, lon: 88.6065, state: "Sikkim", elevation: 1650 },
  Namchi: { lat: 27.1667, lon: 88.35, state: "Sikkim", elevation: 1315 },
  Mangan: { lat: 27.5167, lon: 88.5333, state: "Sikkim", elevation: 1200 },
  Pelling: { lat: 27.3167, lon: 88.2333, state: "Sikkim", elevation: 2150 },
  Shimla: { lat: 31.1048, lon: 77.1734, state: "Himachal Pradesh", elevation: 2276 },
  Manali: { lat: 32.2432, lon: 77.1892, state: "Himachal Pradesh", elevation: 2050 },
  Dharamshala: { lat: 32.219, lon: 76.3234, state: "Himachal Pradesh", elevation: 1457 },
  Kullu: { lat: 31.9579, lon: 77.1095, state: "Himachal Pradesh", elevation: 1279 },
  Dehradun: { lat: 30.3165, lon: 78.0322, state: "Uttarakhand", elevation: 435 },
  Nainital: { lat: 29.3919, lon: 79.4542, state: "Uttarakhand", elevation: 2084 },
  Mussoorie: { lat: 30.4598, lon: 78.0644, state: "Uttarakhand", elevation: 2005 },
  Joshimath: { lat: 30.5566, lon: 79.5667, state: "Uttarakhand", elevation: 1890 },
  Shillong: { lat: 25.5788, lon: 91.8933, state: "Meghalaya", elevation: 1525 },
  Cherrapunji: { lat: 25.2986, lon: 91.7378, state: "Meghalaya", elevation: 1430 },
  Tura: { lat: 25.5138, lon: 90.2201, state: "Meghalaya", elevation: 349 },
  Jowai: { lat: 25.445, lon: 92.203, state: "Meghalaya", elevation: 1380 },
  Haflong: { lat: 25.1764, lon: 93.0232, state: "Assam", elevation: 680 },
  Guwahati: { lat: 26.1445, lon: 91.7362, state: "Assam", elevation: 55 },
  Silchar: { lat: 24.8333, lon: 92.7789, state: "Assam", elevation: 25 },
  Wayanad: { lat: 11.6854, lon: 76.132, state: "Kerala", elevation: 1000 },
  Munnar: { lat: 10.0889, lon: 77.0595, state: "Kerala", elevation: 1532 },
  Idukki: { lat: 9.8494, lon: 76.9723, state: "Kerala", elevation: 1200 },
  Darjeeling: { lat: 27.041, lon: 88.2663, state: "West Bengal", elevation: 2042 },
  Kalimpong: { lat: 27.0667, lon: 88.4667, state: "West Bengal", elevation: 1250 },
  Kurseong: { lat: 26.8833, lon: 88.2833, state: "West Bengal", elevation: 1458 },
  Srinagar: { lat: 34.0837, lon: 74.7973, state: "Jammu & Kashmir", elevation: 1585 },
  Gulmarg: { lat: 34.0484, lon: 74.3805, state: "Jammu & Kashmir", elevation: 2650 },
  Pahalgam: { lat: 34.0167, lon: 75.3167, state: "Jammu & Kashmir", elevation: 2130 },
  Tawang: { lat: 27.5861, lon: 91.8594, state: "Arunachal Pradesh", elevation: 3048 },
  Itanagar: { lat: 27.0844, lon: 93.6053, state: "Arunachal Pradesh", elevation: 320 },
  Kohima: { lat: 25.6747, lon: 94.1077, state: "Nagaland", elevation: 1444 },
  Dimapur: { lat: 25.9068, lon: 93.7274, state: "Nagaland", elevation: 145 },
  Aizawl: { lat: 23.7271, lon: 92.7176, state: "Mizoram", elevation: 1132 },
  Lunglei: { lat: 22.8833, lon: 92.7333, state: "Mizoram", elevation: 1222 },
};

export interface TectonicGeologyData {
  faultLine: string;
  seismicZone: string;
  plateMovementRate: string;
  baseTremorGal: number;
  historicalEarthquakes: string;
  assemblyPoint: string;
  evacuationRoutes: string[];
}

export const TECTONIC_REGIONS: Record<string, TectonicGeologyData> = {
  gangtok: {
    faultLine: "Main Central Thrust (MCT) & Teesta Transverse Fault",
    seismicZone: "Zone IV - Severe Seismic Vulnerability",
    plateMovementRate: "48 mm/yr Indian Plate Northward Collision",
    baseTremorGal: 5.2,
    historicalEarthquakes: "2011 Sikkim Mw 6.9; 1897 Great Assam Tremors",
    assemblyPoint: "Paljor Stadium & Burtuk Ridge Grounds, Gangtok",
    evacuationRoutes: ["NH-10 Upper Ridge Bypass towards Rangpo", "Burtuk Helipad Safe Corridor"],
  },
  shimla: {
    faultLine: "Main Boundary Thrust (MBT) & Krol Thrust",
    seismicZone: "Zone IV - High Seismotectonic Hazard",
    plateMovementRate: "52 mm/yr Himalayan Convergence",
    baseTremorGal: 4.8,
    historicalEarthquakes: "1905 Kangra Mw 7.8; 1975 Kinnaur Mw 6.8",
    assemblyPoint: "The Ridge & Chaura Maidan Open Grounds, Shimla",
    evacuationRoutes: ["Shimla Bypass Corridor (NH-5)", "Tara Devi High Ridge Access"],
  },
  dehradun: {
    faultLine: "Main Frontal Thrust (MFT) & Krol-Tal Nappe",
    seismicZone: "Zone IV/V - Frontal Himalayan Active Zone",
    plateMovementRate: "50 mm/yr Underthrusting",
    baseTremorGal: 4.5,
    historicalEarthquakes: "1991 Uttarkashi Mw 6.8; 1999 Chamoli Mw 6.6",
    assemblyPoint: "Parade Ground & District Sports Pavilion, Dehradun",
    evacuationRoutes: ["Rajpur Road Upper Elevation Avenue", "Mussoorie High Ground Link"],
  },
  shillong: {
    faultLine: "Dauki Fault & Oldham Fault Belt",
    seismicZone: "Zone V - Maximum Seismic Hazard Zone",
    plateMovementRate: "46 mm/yr Shillong Plateau Uplift",
    baseTremorGal: 6.1,
    historicalEarthquakes: "1897 Great Assam Mw 8.1 (Oldham Fault rupture)",
    assemblyPoint: "Polo Ground & Garrison Open Grounds, Shillong",
    evacuationRoutes: ["Shillong Bypass Expressway", "Laitkor Peak Ridgeline Link"],
  },
  haflong: {
    faultLine: "Kopili Fault & Disang Thrust System",
    seismicZone: "Zone V - Very High Seismic Instability",
    plateMovementRate: "45 mm/yr Indo-Burman Compression",
    baseTremorGal: 5.8,
    historicalEarthquakes: "1950 Assam-Tibet Mw 8.6; 2021 Dhekiajuli Mw 6.4",
    assemblyPoint: "Dima Hasao Sports Council Stadium, Haflong",
    evacuationRoutes: ["NH-54E High Ground Ridge Bypass", "Mahur Valley Upper Spur"],
  },
  wayanad: {
    faultLine: "Bavali Shear Zone & Western Ghats Escarpment",
    seismicZone: "Zone III - Moderate Seismic with High Rain Trigger",
    plateMovementRate: "Peninsular Intraplate Stress Adjustments",
    baseTremorGal: 3.2,
    historicalEarthquakes: "2024 Meppadi Debris Flow; Western Ghats micro-tremors",
    assemblyPoint: "Kalpetta SKMJ High School Open Ground, Wayanad",
    evacuationRoutes: ["Kozhikode-Kollegal Highway (NH-766)", "Mananthavady Ridge Link"],
  },
  darjeeling: {
    faultLine: "Main Central Thrust (MCT) & Gish Fault",
    seismicZone: "Zone IV - Eastern Himalayan Fragile Belt",
    plateMovementRate: "49 mm/yr Plate Collision",
    baseTremorGal: 5.0,
    historicalEarthquakes: "1934 Bihar-Nepal Mw 8.0; 2011 Sikkim Tremor",
    assemblyPoint: "Gorkha Stadium & St. Joseph Open Grounds, Darjeeling",
    evacuationRoutes: ["Hill Cart Road (NH-110) Upper Diverter", "Peshok Ridge Way"],
  },
  srinagar: {
    faultLine: "Panjal Thrust & Balapora Active Fault",
    seismicZone: "Zone V - Very High Seismic Vulnerability",
    plateMovementRate: "53 mm/yr Pamir-Himalayan Arc Compression",
    baseTremorGal: 6.4,
    historicalEarthquakes: "2005 Kashmir Mw 7.6; 1885 Baramulla Earthquake",
    assemblyPoint: "Bakshi Stadium & Polo Ground, Srinagar",
    evacuationRoutes: ["NH-44 Bypass Upper Ridge Corridor", "Boulevard Upper Elevation Ring"],
  },
};

export const DEFAULT_TECTONIC_DATA: TectonicGeologyData = {
  faultLine: "Himalayan Frontal Thrust / Regional Mountain Shear Zone",
  seismicZone: "Zone IV - High Seismotectonic Vulnerability",
  plateMovementRate: "48 mm/yr Indian Plate Collision",
  baseTremorGal: 4.8,
  historicalEarthquakes: "Active Himalayan seismo-tectonic belt with micro-tremor swarms",
  assemblyPoint: "District Central Sports Ground & Government High School Pavilion",
  evacuationRoutes: ["Primary Arterial Ridge Road", "Elevated Bypass Corridor"],
};

export function evaluateLandslideRisk(
  precipMm: number,
  humidity: number,
  elevation: number = 1000,
  city: string = "Gangtok",
  simulatedTremorGal: number = 0,
  simulatedExtraRain: number = 0
) {
  const cityKey = city.trim().toLowerCase();
  const tectonicInfo = TECTONIC_REGIONS[cityKey] || DEFAULT_TECTONIC_DATA;

  const totalRainMm = Math.max(0, precipMm + simulatedExtraRain);
  let rainfallPoints = 0;
  if (totalRainMm === 0) {
    rainfallPoints = 3;
  } else if (totalRainMm <= 3) {
    rainfallPoints = Math.round(totalRainMm * 4);
  } else if (totalRainMm <= 10) {
    rainfallPoints = Math.round(12 + (totalRainMm - 3) * 2.8);
  } else {
    rainfallPoints = Math.min(45, Math.round(32 + (totalRainMm - 10) * 1.5));
  }

  const effectiveTremorGal = Math.max(0, tectonicInfo.baseTremorGal + simulatedTremorGal);
  let tectonicPoints = 0;
  let tremorStatus: "QUIET" | "MICRO_TREMOR" | "ACTIVE_SEISMIC" = "QUIET";

  if (effectiveTremorGal < 8) {
    tectonicPoints = Math.round(8 + effectiveTremorGal * 0.8);
    tremorStatus = "QUIET";
  } else if (effectiveTremorGal < 20) {
    tectonicPoints = Math.round(14 + (effectiveTremorGal - 8) * 1.2);
    tremorStatus = "MICRO_TREMOR";
  } else {
    tectonicPoints = Math.min(35, Math.round(28 + (effectiveTremorGal - 20) * 0.7));
    tremorStatus = "ACTIVE_SEISMIC";
  }

  let slopePoints = 4;
  if (humidity > 70) {
    slopePoints += Math.round((humidity - 70) * 0.25);
  }
  if (elevation > 1200) {
    slopePoints += Math.min(8, Math.round((elevation / 2500) * 8));
  }
  slopePoints = Math.min(20, Math.max(4, slopePoints));

  const totalScore = Math.max(1, Math.min(100, Math.round(rainfallPoints + tectonicPoints + slopePoints)));
  const isWarningActive = totalScore > 50;

  let level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  let statusTitle: string;
  let summary: string;
  let badgeClass: string;
  let colorHex: string;

  if (totalScore >= 75) {
    level = "CRITICAL";
    statusTitle = `CRITICAL ALERT (${totalScore}/100)`;
    summary = `Severe landslide danger! Heavy rainfall (${totalRainMm.toFixed(1)} mm) coupled with tectonic vibrations (${effectiveTremorGal.toFixed(1)} Gal) along the ${tectonicInfo.faultLine} has critically saturated mountain slopes.`;
    badgeClass = "bg-rose-500/20 text-rose-300 border-rose-500/50";
    colorHex = "#f43f5e";
  } else if (totalScore > 50) {
    level = "HIGH";
    statusTitle = `WARNING LEVEL EXCEEDED (${totalScore}/100)`;
    summary = `Elevated landslide warning! Risk score (${totalScore}/100) exceeds safety threshold (>50). Active rainfall (${totalRainMm.toFixed(1)} mm) and regional tectonic seismic stress elevate risk of debris flows.`;
    badgeClass = "bg-orange-500/20 text-orange-300 border-orange-500/50";
    colorHex = "#f97316";
  } else if (totalScore >= 30) {
    level = "MODERATE";
    statusTitle = `Moderate Caution (${totalScore}/100)`;
    summary = `Slope conditions require vigilance. Rainfall is ${totalRainMm.toFixed(1)} mm with normal ambient plate vibration (${effectiveTremorGal.toFixed(1)} Gal). Safe for cautious transit.`;
    badgeClass = "bg-amber-500/20 text-amber-300 border-amber-500/50";
    colorHex = "#f59e0b";
  } else {
    level = "LOW";
    statusTitle = `Low Threat / Normal (${totalScore}/100)`;
    summary = `Geological and meteorological stability verified (${totalScore}/100). Rainfall is minimal (${totalRainMm.toFixed(1)} mm) with calm seismic activity (${effectiveTremorGal.toFixed(1)} Gal).`;
    badgeClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
    colorHex = "#10b981";
  }

  const howToStaySafe = isWarningActive
    ? [
        "Vacate ground-floor rooms directly facing steep hillside soil cuttings.",
        "Inspect walls and doors: sticking doors or sudden widening cracks indicate foundational slope creep.",
        "Listen for unusual rumbling, cracking branches, or sudden brown muddy water flowing from drains.",
        "Avoid traveling on mountain highways and ghat passes, especially after sunset.",
        "Never cross bridges or culverts where fast-flowing brown mud and tree limbs are visible.",
      ]
    : [
        "Maintain standard mountain driving precautions and keep vehicle wipers and lights active.",
        "Keep drainage gutters around hillside buildings clear of fallen leaves and loose silt.",
        "Stay informed with official local weather advisories before traveling across mountain passes.",
      ];

  const evacuationPlan = {
    assemblyPoint: tectonicInfo.assemblyPoint,
    evacuationRoutes: tectonicInfo.evacuationRoutes,
    bufferDistanceMeters: totalScore >= 75 ? 300 : 150,
    safeShelterName: `Designated District Disaster Relief Center (${city})`,
    checklist: [
      "Potable drinking water (minimum 3L per person)",
      "First-aid medical kit and essential prescription medicines",
      "High-power waterproof LED torch with spare batteries",
      "Government photo IDs and property deeds sealed in a waterproof bag",
      "Emergency thermal blanket, warm jacket, and sturdy mountain shoes",
    ],
  };

  const authorityWarning = {
    alertId: `SOS-LEWS-${city.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-6)}`,
    targetAgencies: [
      "State Disaster Management Authority (SDMA)",
      "National Disaster Response Force (NDRF 12th Battalion)",
      "District Magistrate & Police Control Room (112)",
      "Border Roads Organisation (BRO) Hill Highway Clearance",
    ],
    recommendedAction:
      totalScore >= 75
        ? "Deploy immediate evacuation directives for vulnerable downhill clusters. Dispatch NDRF hill rescue unit and halt heavy commercial freight along highway passes."
        : "Alert highway patrol teams, pre-position JCB excavators at prone hairpin curves, and initiate public warning sirens.",
    priority: totalScore >= 75 ? ("CRITICAL_EVACUATION" as const) : ("ELEVATED_WARNING" as const),
    dispatchedAt: new Date().toLocaleTimeString(),
  };

  return {
    level,
    score: totalScore,
    isWarningActive,
    statusTitle,
    summary,
    badgeClass,
    colorHex,
    scoreBreakdown: {
      rainfallPoints,
      tectonicPoints,
      slopePoints,
      totalScore,
    },
    tectonicData: {
      faultLine: tectonicInfo.faultLine,
      seismicZone: tectonicInfo.seismicZone,
      plateMovementRate: tectonicInfo.plateMovementRate,
      vibrationGal: Number(effectiveTremorGal.toFixed(1)),
      tremorStatus,
      historicalEarthquakes: tectonicInfo.historicalEarthquakes,
    },
    evacuationPlan,
    authorityWarning,
    howToStaySafe,
    precautions: howToStaySafe,
  };
}

export function generateLocalStationData(
  city: string = "Gangtok",
  preferredState?: string,
  simulatedTremorGal: number = 0,
  simulatedExtraRain: number = 0
): RealStationData {
  const cleanCity = city.trim();
  const known = KNOWN_COORDINATES[cleanCity] || {
    lat: 27.3389,
    lon: 88.6065,
    state: preferredState || "Sikkim",
    elevation: 1650,
  };

  const fallbackPrecip = 1.8;
  const fallbackHumidity = 86;
  const risk = evaluateLandslideRisk(
    fallbackPrecip,
    fallbackHumidity,
    known.elevation,
    cleanCity,
    simulatedTremorGal,
    simulatedExtraRain
  );

  return {
    id: cleanCity.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    city: cleanCity,
    state: known.state,
    location: {
      name: cleanCity,
      region: known.state,
      country: "India",
      lat: known.lat,
      lon: known.lon,
      localtime: new Date().toLocaleTimeString(),
    },
    weather: {
      temperature: 18,
      feelslike: 19,
      weather_descriptions: ["Mountain Mist & Light Showers"],
      weather_icons: [
        "https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0025_light_rain_showers_night.png",
      ],
      precip: Number((fallbackPrecip + simulatedExtraRain).toFixed(1)),
      humidity: fallbackHumidity,
      wind_speed: 6,
      wind_dir: "NE",
      pressure: 1014,
      cloudcover: 80,
      uv_index: 1,
      visibility: 9,
      is_day: "no",
      observation_time: "Telemetry Station Feed",
    },
    risk,
    isLiveWeatherstack: false,
    elevationMeters: known.elevation,
    terrainDescription: `Mountain elevation approx. ${known.elevation}m above sea level in ${known.state}.`,
  };
}

export function generateFallbackReport(params?: {
  city?: string;
  state?: string;
  riskScore?: number;
  precip?: number;
  temperature?: number;
  humidity?: number;
  tectonicFault?: string;
  vibrationGal?: number;
  stationData?: RealStationData | null;
}): AiAnalysisResult {
  const c = params?.city || "Hill District";
  const s = params?.state || "India";
  const score = params?.riskScore ?? 45;
  const precip = params?.precip ?? 2.5;
  const humidity = params?.humidity ?? 85;
  const fault = params?.tectonicFault || "Main Boundary Thrust (MBT)";
  const vibration = params?.vibrationGal ?? 5.2;

  const isCritical = score >= 50;

  const riskLevel: RiskLevel = score >= 75 ? "CRITICAL" : score >= 50 ? "HIGH" : score >= 30 ? "MODERATE" : "LOW";

  const telemetryReport = {
    city: c,
    state: s,
    country: "India",
    latitude: params?.stationData?.location?.lat || 27.33,
    longitude: params?.stationData?.location?.lon || 88.61,
    elevationMeters: params?.stationData?.elevationMeters || 1650,
    observationTime: new Date().toLocaleTimeString(),
    localTime: new Date().toLocaleTimeString(),
    temperature: params?.temperature ?? 18,
    feelsLike: (params?.temperature ?? 18) + 1,
    weatherDescription: params?.stationData?.weather?.weather_descriptions?.[0] || "Mountain Rain & Mist",
    precipitationMm: precip,
    humidityPercent: humidity,
    windSpeedKmh: params?.stationData?.weather?.wind_speed ?? 8,
    windDirection: params?.stationData?.weather?.wind_dir || "NE",
    pressureMb: params?.stationData?.weather?.pressure ?? 1013,
    visibilityKm: params?.stationData?.weather?.visibility ?? 10,
    cloudCoverPercent: params?.stationData?.weather?.cloudcover ?? 85,
    vibrationGal: vibration,
    faultLine: fault,
    seismicZone: "Zone IV - High Seismotectonic Vulnerability",
    tremorStatus: (vibration > 20 ? "ACTIVE_SEISMIC" : vibration > 8 ? "MICRO_TREMOR" : "QUIET") as "QUIET" | "MICRO_TREMOR" | "ACTIVE_SEISMIC",
    plateConvergenceRate: "48-52 mm/yr Indian Continental Plate Collision",
    riskScore: score,
    riskLevel,
    scoreBreakdown: {
      rainfallPoints: Math.round(score * 0.45),
      tectonicPoints: Math.round(score * 0.35),
      slopePoints: Math.round(score * 0.20),
      totalScore: score,
    },
  };

  const criticalGuide = {
    isCritical,
    urgencyLevel: (score >= 75
      ? "CRITICAL_IMMEDIATE_ACTION"
      : score > 50
      ? "HIGH_ALERT_PREPARATION"
      : "MODERATE_WATCH") as "CRITICAL_IMMEDIATE_ACTION" | "HIGH_ALERT_PREPARATION" | "MODERATE_WATCH",
    statusHeading: isCritical
      ? `CODE RED EMERGENCY PROTOCOL: Critical Landslide Threat in ${c}`
      : `STANDARD ADVISORY: Monitoring Active Slope Telemetry in ${c}`,
    immediateActions: [
      "Alert immediate household members and assist elderly, children, and persons with disabilities.",
      "Shut off the main electrical breaker and securely turn off domestic LPG gas cylinder valves to avert fire hazards.",
      "Grab the prepared Emergency Go-Bag containing essential medications, drinking water, and sealed identity documents.",
      "Evacuate along designated high-ridge pedestrian corridors; never attempt to cross debris-laden gullies or bridges.",
    ],
    evacuationRoutesProtocol:
      "Always evacuate perpendicular to the path of potential mudflows or slide gullies. Move UPWARDS toward solid bedrock ridges rather than downstream along valley troughs or river bends.",
    sensoryWarningSigns: [
      "Sudden muddying or silting of previously clear hillside springs or stream waters.",
      "New diagonal cracking in exterior masonry walls, concrete retaining structures, or paved pathways.",
      "Fences, utility poles, or trees visibly tilting downhill away from their vertical orientation.",
      "Subterranean rumbling, grinding, or loud cracking sounds originating from the uphill slope.",
    ],
    safeAssemblyZone: `High-elevation open grounds, sports stadiums, and designated reinforced civic shelters situated on firm bedrock ridgelines well away from steep uphill banks in ${c}.`,
    essentialGoBagChecklist: [
      "Minimum 3 litres of potable bottled drinking water per family member.",
      "Multi-day supply of personal prescription medications and comprehensive first-aid supplies.",
      "High-output waterproof LED torch / headlamp with extra sealed batteries.",
      "Government identification documents, insurance records, and property deeds in a waterproof zip pouch.",
    ],
    authoritiesToNotify: [
      { agency: "National Emergency Service", contact: "112", role: "Central police, ambulance, and disaster dispatch" },
      { agency: "District Disaster Management Authority (DDMA)", contact: "1077", role: "Localized landslide rescue & evacuation shelter info" },
      { agency: "National Disaster Response Force (NDRF)", contact: "011-24363260", role: "Specialized mountain rescue & search deployment" },
      { agency: "National Highways & BRO Control", contact: "1033", role: "Highway road blockages, boulder clearance & traffic diversions" },
    ],
  };

  return {
    city: c,
    state: s,
    title: `Comprehensive Landslide Risk & Telemetry Dossier: ${c}, ${s}`,
    situationSummary: `Current observations in ${c} show precipitation at ${precip} mm with ${humidity}% humidity. Landslide vulnerability is rated ${riskLevel} (Score: ${score}/100).`,
    travelSafetyStatus: isCritical
      ? "Non-essential mountain travel is restricted due to heightened rockfall risks."
      : "Travel is permissible with standard defensive hill driving precautions.",
    telemetrySnapshot: telemetryReport,
    telemetryReport,
    criticalGuide,
    geologicalExplanation: {
      soilSaturationMechanics: `In the ${c} sector of ${s}, continuous ambient precipitation (${precip} mm/hr) and high atmospheric moisture (${humidity}%) infiltrate weathered colluvium and topsoil layers. Interstitial pore-water pressure builds rapidly within loose overburden, diminishing effective cohesion along shear slip boundaries.`,
      tectonicShearStress: `Active proximity to the ${fault} subjects underlying bedrock formations to background micro-vibrations (${vibration} Gal). Micro-seismic vibrations induce cyclical shear stress across dip-slip planes, accelerating mechanical destabilization of pre-existing joints and fractures.`,
      slopeTerrainVulnerability: `Steep mountain topography coupled with engineered highway cuttings creates unsupported slope toes. Gravitational driving force is elevated by hydraulic surcharge from saturated colluvium resting above impermeable phyllite/schist bedrocks.`,
      overallSynthesis: isCritical
        ? `GEOTECHNICAL WARNING: Multi-parameter convergence indicates that the safety threshold has been breached (${score}/100). Saturated hillside overburden combined with active crustal vibrations makes debris flow initiation probable.`
        : `CONTROLLED STABILITY: Composite landslide risk score is currently ${score}/100. Soil saturation and seismic vibration levels are within monitored tolerance thresholds, but persistent downpours may accelerate saturation.`,
      criticalRiskFactors: [
        `Elevated pore-water pressure in unconsolidated mountain colluvium (${humidity}% relative humidity).`,
        `Seismo-tectonic friction along the active ${fault} (${vibration} Gal).`,
        `Unsupported roadside slope geometry and drainage surcharge along highway corridors.`,
        `Forward weather prognosis predicting further orographic hill showers.`,
      ],
      prognosisNext12Hours: isCritical
        ? `HIGH HAZARD: Rainfall accumulation will continue to saturate shear planes over the next 12 hours. Saturated slopes face high potential for shallow rotational slips and rockfall along road cuttings.`
        : `STABLE VIGILANCE: Slopes are expected to retain shear stability over the next 12 hours under present precipitation rates. Routine drainage clearance and visual slope monitoring are advised.`,
    },
    evacuationAndSurvivalGuide: {
      isCriticalSituation: isCritical,
      immediateEvacuationDirective: isCritical
        ? `EMERGENCY DIRECTIVE: Landslide Risk Score (${score}/100) has exceeded the public safety ceiling. Residents living below steep soil cuttings or adjacent to swelling natural torrents should immediately prepare to evacuate to designated safe ridgeline shelters.`
        : `ADVISORY DIRECTIVE: Conditions currently do not mandate mandatory evacuation. Citizens should maintain normal vigilance, verify emergency go-bag readiness, and monitor hill road status updates.`,
      stepByStepActions: [
        "Alert immediate household members and assist elderly, children, and persons with disabilities.",
        "Shut off the main electrical breaker and securely turn off domestic LPG gas cylinder valves to avert fire hazards.",
        "Grab the prepared Emergency Go-Bag containing essential medications, drinking water, and sealed identity documents.",
        "Evacuate along designated high-ridge pedestrian corridors; never attempt to cross debris-laden gullies or bridges.",
        "Report any fresh surface tension cracks or tilting utility poles immediately to District Disaster Control (1077 or 112).",
      ],
      evacuationRoutingRule:
        "Always evacuate perpendicular to the path of potential mudflows or slide gullies. Move UPWARDS toward solid bedrock ridges rather than downstream along valley troughs or river bends.",
      warningSignsToLookFor: [
        "Sudden muddying or silting of previously clear hillside springs or stream waters.",
        "New diagonal cracking in exterior masonry walls, concrete retaining structures, or paved pathways.",
        "Fences, utility poles, or trees visibly tilting downhill away from their vertical orientation.",
        "Subterranean rumbling, grinding, or loud cracking sounds originating from the uphill slope.",
        "Doors or windows sticking or binding tightly in frames due to foundational shear displacement.",
      ],
      emergencyKitChecklist: [
        "Minimum 3 litres of potable bottled drinking water per family member.",
        "Multi-day supply of personal prescription medications and comprehensive first-aid supplies.",
        "High-output waterproof LED torch / headlamp with extra sealed batteries.",
        "Government identification documents, insurance records, and property deeds in a waterproof zip pouch.",
        "Thermal foil survival blanket, warm rainproof outer jacket, and heavy-tread hiking footwear.",
        "Charged mobile power bank with charging cables and a battery-powered FM emergency radio receiver.",
      ],
      safeAssemblyZoneDescription: `High-elevation open grounds, sports stadiums, and designated reinforced civic shelters situated on firm bedrock ridgelines well away from steep uphill banks in ${c}.`,
      emergencyHelplines: [
        { agency: "National Emergency Service", phone: "112", description: "Central police, ambulance, and disaster dispatch" },
        { agency: "District Disaster Management Authority (DDMA)", phone: "1077", description: "Localized landslide rescue & evacuation shelter info" },
        { agency: "National Disaster Response Force (NDRF)", phone: "011-24363260", description: "Specialized mountain rescue & search deployment" },
        { agency: "National Highways & BRO Control", phone: "1033", description: "Highway road blockages, boulder clearance & traffic diversions" },
      ],
    },
    keyPrecautions: [
      "Maintain vigilance on road cuts with exposed boulders or loose soil mantles.",
      "Keep mobile devices charged and monitor local disaster radio broadcasts.",
      "Do not seek shelter inside basements or ground-floor rooms abutting mountain slopes.",
      "Report any road fissure or mud pooling immediately to District Emergency (1077).",
    ],
    emergencyHelplines: [
      { name: "National Emergency Helpline", number: "112" },
      { name: "State Disaster Authority (SDMA)", number: "1077" },
      { name: "National Highway Helpline", number: "1033" },
      { name: "Ambulance Emergency", number: "108" },
    ],
    lastUpdated: new Date().toLocaleTimeString(),
    generatedByModel: "Geotechnical Intelligence Engine (Deterministic Heuristic Model)",
  };
}
