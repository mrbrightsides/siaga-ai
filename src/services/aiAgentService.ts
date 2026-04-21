
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface AgentAction {
  id: string;
  timestamp: string;
  incidentType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Extreme';
  analysis: string;
  dispatchedActions: string[];
  location: [number, number];
  coordinates: string;
}

export async function processCitizenReport(description: string, imageBase64?: string): Promise<AgentAction> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are the SIAGA Jalan AI Autonomous Agent. Your job is to analyze citizen reports about urban hazards (floods, accidents, debris) and take immediate autonomous actions.
    
    If an image is provided, analyze it carefully for hazard type and severity.
    
    Severity Rules:
    - Low: Minor puddles, small debris, no traffic impact.
    - Medium: 30-50cm water, slowing traffic, major debris.
    - High: >50cm water, stalled vehicles, blocked roads.
    - Extreme: Flash floods, life-threatening, critical infrastructure failure.

    Actions you can dispatch:
    - Reroute public transport (TransJakarta)
    - Notify BPBD (Emergency Services)
    - Activate Smart Flood Barriers
    - Deploy rapid response drones
    - Update public variable messaging signs (VMS)
  `;

  const prompt = `
    INCIDENT REPORT:
    "${description}"
    
    Analyze this report and provide an autonomous response in a structured JSON format.
  `;

  const contents: any = { parts: [{ text: prompt }] };
  if (imageBase64) {
    contents.parts.unshift({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [contents],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            incidentType: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Extreme'] },
            analysis: { type: Type.STRING },
            dispatchedActions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["incidentType", "severity", "analysis", "dispatchedActions"]
        }
      }
    });

    const result = JSON.parse(response.text);
    
    // Mock coordinates near Jakarta center if none given, or slightly randomized for demo
    const lat = -6.2088 + (Math.random() - 0.5) * 0.1;
    const lng = 106.8456 + (Math.random() - 0.5) * 0.1;

    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      ...result,
      location: [lat, lng],
      coordinates: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    };
  } catch (error) {
    console.error("AI Agent process failed:", error);
    // Fallback if AI fails
    return {
      id: 'err-' + Date.now(),
      timestamp: new Date().toISOString(),
      incidentType: 'Hazard',
      severity: 'Medium',
      analysis: 'Manual verification required due to processing threshold.',
      dispatchedActions: ['Deploy inspection drone', 'Alert traffic control'],
      location: [-6.2088, 106.8456],
      coordinates: '-6.2088, 106.8456'
    };
  }
}

export interface PredictiveAlert {
  location: string;
  source: string;
  eta: string;
  recommendation: string;
  severity: 'Low' | 'Medium' | 'High' | 'Extreme';
}

export function getPredictiveAlert(): PredictiveAlert | null {
  // Simulated prediction based on Katulampa data trends
  return {
    location: "Kawasan Bidara Cina & Kampung Melayu",
    source: "Pintu Air Katulampa (Level Siaga 1)",
    eta: "3.5 Hours",
    recommendation: "Segera evakuasi kendaraan ke lokasi parkir darurat yang lebih tinggi (Area GOR Tebet).",
    severity: 'Extreme'
  };
}

export interface DisasterBrief {
  title: string;
  summary: string;
  whatsappMessage: string;
  affectedZones: string[];
}

export function generateDisasterBrief(severity: string, location: string): DisasterBrief {
  const message = `🚨 *SIAGA JALAN: EMERGENCY ALERT* 🚨\n\nStatus: *${severity.toUpperCase()}*\nLokasi: *${location}*\n\nAnalisis AI: Debit air meningkat drastis. Seluruh warga diharapkan segera mengamankan aset berharga dan parkir kendaraan di zona radius aman (Peta tersedia di aplikasi).\n\nCek rute aman: https://siaga-ai.vercel.app/routes`;
  
  return {
    title: `Ops Brief: ${location}`,
    summary: `AI Agentic system has detected ${severity} flood conditions. Predictive models show high risk in surrounding corridors.`,
    whatsappMessage: message,
    affectedZones: [location, 'Radius 500m']
  };
}
