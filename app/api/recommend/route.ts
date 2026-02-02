
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getAIFoodRecommendations = async (
  cravings: string, 
  restrictions: string, 
  location: { latitude: number; longitude: number } | null
) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `Find restaurants and cafes that satisfy these cravings: "${cravings}". 
  Take note of these dietary restrictions: "${restrictions}".
  Suggest local places and explain why they are a good match.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: location ? {
              latitude: location.latitude,
              longitude: location.longitude
            } : {
              latitude: 37.7749, // Fallback to SF if location unavailable
              longitude: -122.4194
            }
          }
        }
      },
    });

    return {
      text: response.text || "I couldn't find specific recommendations for that right now.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};