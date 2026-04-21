
import { SensorData } from '../types';

const BASE_URL = 'https://data.petabencana.id/v2';

export interface PetaBencanaReport {
  properties: {
    report_type: string;
    text: string;
    created_at: string;
    image_url: string | null;
    severity: {
      percentage: number;
    } | null;
  };
  coordinates: [number, number];
}

// Fallback high-quality mock data for Hackathon resilience
const MOCK_REPORTS: PetaBencanaReport[] = [
  {
    properties: {
      report_type: 'flood',
      text: 'Genangan air setinggi 30-50cm di ruas jalan depan Mall Kelapa Gading. Kendaraan kecil sulit melintas.',
      created_at: new Date().toISOString(),
      image_url: null,
      severity: { percentage: 65 }
    },
    coordinates: [106.9007, -6.1585]
  },
  {
    properties: {
      report_type: 'flood',
      text: 'Banjir di kawasan Jatiasih, air mulai memasuki halaman rumah warga. Ketinggian sekitar 40cm.',
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      image_url: null,
      severity: { percentage: 40 }
    },
    coordinates: [106.9453, -6.2917]
  },
  {
    properties: {
      report_type: 'flood',
      text: 'Jl. Kemang Raya tergenang air luapan Kali Krukut. Arus cukup deras, hindari jalur ini.',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      image_url: null,
      severity: { percentage: 85 }
    },
    coordinates: [106.8152, -6.2526]
  }
];

const MOCK_GAUGES: SensorData[] = [
  { id: 'gauge-1', location: 'Katulampa Dam', waterLevel: 120, threshold: 100, rainfall: 45, risk: 'Extreme', lastUpdated: new Date().toISOString() },
  { id: 'gauge-2', location: 'Manggarai Gate', waterLevel: 85, threshold: 90, rainfall: 32, risk: 'High', lastUpdated: new Date().toISOString() },
  { id: 'gauge-3', location: 'Karet Sluice', waterLevel: 65, threshold: 80, rainfall: 28, risk: 'Medium', lastUpdated: new Date().toISOString() }
];

export const fetchFloods = async () => {
  try {
    const response = await fetch(`${BASE_URL}/floods`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('API unstable');
    const data = await response.json();
    return (data.result?.objects?.output?.geometries || []) as any[];
  } catch (error) {
    console.warn('Falling back to mock floods:', error);
    return [];
  }
};

export const fetchFloodTimeSeries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/floods/timeseries`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('API unstable');
    const data = await response.json();
    return (data.result?.objects?.output?.geometries || []) as any[];
  } catch (error) {
    console.warn('Error fetching flood timeseries:', error);
    return [];
  }
};

export const fetchReportTimeSeries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/reports/timeseries`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('API unstable');
    const data = await response.json();
    return (data.result?.objects?.output?.geometries || []) as any[];
  } catch (error) {
    console.warn('Error fetching report timeseries:', error);
    return [];
  }
};

export const fetchLiveReports = async (city: string = 'jkt') => {
  try {
    const response = await fetch(`${BASE_URL}/reports?city=${city}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('API unstable or CORS restricted');
    const data = await response.json();
    return (data.result?.objects?.output?.geometries || MOCK_REPORTS) as PetaBencanaReport[];
  } catch (error) {
    console.warn('Falling back to mock reports due to API error:', error);
    return MOCK_REPORTS;
  }
};

export const fetchFloodGauges = async () => {
  try {
    const response = await fetch(`${BASE_URL}/floodgauges`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('API unstable or CORS restricted');
    const data = await response.json();
    
    const geometries = data.result?.objects?.output?.geometries;
    if (!geometries) return MOCK_GAUGES;

    return geometries.map((g: any, i: number) => ({
      id: `gauge-${i}`,
      location: g.properties.name || 'Unknown Station',
      waterLevel: g.properties.gauge_height || 0,
      threshold: 100,
      rainfall: 0,
      risk: (g.properties.gauge_height > 100 ? 'Extreme' : 
             g.properties.gauge_height > 70 ? 'High' : 
             g.properties.gauge_height > 40 ? 'Medium' : 'Low'),
      lastUpdated: new Date().toISOString()
    })) as SensorData[];
  } catch (error) {
    console.warn('Falling back to mock gauges due to API error:', error);
    return MOCK_GAUGES;
  }
};
