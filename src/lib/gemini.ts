
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeFloodVisual = async (imageBase64: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64,
              },
            },
            {
              text: "Analyze this image from a road surveillance camera for flood monitoring. Identify: 1. Water presence on the road. 2. Estimated depth relative to vehicles/curbs. 3. Traffic flow status. Provide a risk score from 0-100 and a recommendation.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isFlooded: { type: Type.BOOLEAN },
            estimatedDepthCm: { type: Type.NUMBER },
            trafficFlow: { type: Type.STRING, description: "Smooth, Slow, or Stalled" },
            riskScore: { type: Type.NUMBER },
            analysis: { type: Type.STRING },
            recommendation: { type: Type.STRING },
          },
          required: ["isFlooded", "estimatedDepthCm", "trafficFlow", "riskScore", "analysis", "recommendation"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing flood visual:", error);
    return null;
  }
};

export const predictFloodRisk = async (sensorHistory: any[], weatherForecast: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the following sensor data history: ${JSON.stringify(sensorHistory)} and weather forecast: ${weatherForecast}, predict the flood risk for the next 6 hours. Provide hourly predictions of water levels and a summary risk assessment.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hourlyPredictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  predictedLevel: { type: Type.NUMBER },
                  riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Extreme"] }
                }
              }
            },
            summaryAssessment: { type: Type.STRING },
            overallRiskScore: { type: Type.NUMBER }
          },
          required: ["hourlyPredictions", "summaryAssessment", "overallRiskScore"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error predicting flood risk:", error);
    return null;
  }
};
