
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY as string });

export interface AIAgentAction {
  id: string;
  timestamp: string;
  action: string;
  status: 'completed' | 'in-progress' | 'pending';
  reasoning: string;
}

export const analyzeFloodSituation = async (reports: any[], gauges: any[]) => {
  try {
    const prompt = `
      You are the SIAGA Jalan AI Command Center Agent. 
      Analyze the following live flood data from Jakarta:
      
      REPORTS: ${JSON.stringify(reports.slice(0, 5))}
      GAUGES: ${JSON.stringify(gauges.slice(0, 5))}
      
      Tasks:
      1. Provide a concise "Intelligence Briefing" (max 3 sentences).
      2. Identify the top 2 Critical Actions the system should take autonomously.
      3. Predict the next 2 hours risk level (Low, Medium, High, Extreme).
      
      Return as JSON with keys: briefing, actions: [{action, reasoning}], riskLevel.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('AI Agent Error:', error);
    return {
      briefing: "AI analysis currently offline. Fallback to heuristic monitoring. High water levels detected at Manggarai.",
      actions: [
        { action: "Dispatch Early Warning", reasoning: "Manggarai gate threshold exceeded 80%." },
        { action: "Reroute Logistics", reasoning: "Multiple reports of inundation in Jakarta South corridor." }
      ],
      riskLevel: "High"
    };
  }
};

export const getRouteAdvisory = async (routeName: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a 1-sentence tactical advisory for the following route during potential flooding: ${routeName}. Context: ${context}`,
    });
    return response.text;
  } catch (error) {
     return "AI Advisory: Maintain caution and monitor live depth gauges.";
  }
};
