"use server";

import { GoogleGenAI } from "@google/genai";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const findRestaurantsByCraving = async (
  craving: string,
  location?: { lat: number; lng: number },
  maxRetries = 3
): Promise<{ text: string; sources: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const locationContext = location 
    ? `Near coordinates ${location.lat}, ${location.lng}` 
    : "in a major city";

  const prompt = `I am craving: "${craving}". 
  ${locationContext}. 
  Suggest 3-4 restaurants that would match this craving. 
  Explain briefly why each fits.
  
  Note: These are suggestions based on general knowledge, not real-time search results.`;

  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        // ✅ REMOVED: No tools - no grounding quota used
      });

      const text = response.text || "I couldn't find any specific matches for that craving. Try something more broad!";
      
      return { text, sources: [] }; // No sources since no grounding
      
    } catch (error: any) {
      lastError = error;
      
      const isRetryable = error.message?.includes("429") || error.message?.includes("500") || error.status === 429;
      
      if (isRetryable && i < maxRetries - 1) {
        const waitTime = Math.pow(2, i) * 1000;
        console.warn(`Gemini API busy. Retrying in ${waitTime}ms...`);
        await delay(waitTime);
        continue;
      }
      
      console.error("Gemini Error:", error);
      break; 
    }
  }

  if (lastError?.message?.includes("429")) {
    throw new Error("The DishDrop Chef is currently overwhelmed by orders (Rate Limit). Please try again in a few moments!");
  }
  
  throw lastError || new Error("Failed to consult the digital chef.");
};
