
export type FloodRisk = 'Low' | 'Medium' | 'High' | 'Extreme';

export type ViewTab = 'Dashboard' | 'Live Map' | 'High Risk Zones' | 'Safe Routes' | 'History Analytics' | 'Spatial Insights' | 'Settings' | 'Profile';

export interface SensorData {
  id: string;
  location: string;
  waterLevel: number; // in cm
  threshold: number; // threshold for danger
  rainfall: number; // in mm/h
  risk: FloodRisk;
  lastUpdated: string;
}

export interface PredictionData {
  time: string;
  predictedLevel: number;
  confidence: number;
}

export interface Route {
  id: string;
  name: string;
  status: 'Safe' | 'Caution' | 'Danger';
  estTime: string;
  floodDepth: number;
}
