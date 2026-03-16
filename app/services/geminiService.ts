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

  const prompt = `You are DishDrop's AI food guide.

I am craving: "${craving}".
User is located: ${locationContext}.

Task:
- Suggest 3-4 specific restaurants that match this craving and location.
- Use your general knowledge to pick *real* restaurants that fit well.
- For each restaurant, include its *official website URL* if you know it.

STRICT FORMAT (Markdown):

Intro section (1-3 paragraphs) explaining how the craving and area influence your picks. You may use **bold** and *italics* here.

Then, for each restaurant, follow this exact pattern:

### 1. Restaurant Name (Neighborhood / Mall / Area)
* **Why it fits:** Short explanation of why this matches the craving.
* **Best for:** Short description of ideal occasion.
* **Vibe:** Optional, 1 sentence about atmosphere.
* Official website: https://example.com

Rules:
- "Official website:" MUST be on its own line for each restaurant, followed by a single URL that starts with http:// or https://.
- If you cannot find the official website, use the best primary link (e.g. Google Maps place, the restaurant's main profile on a major review/delivery site).
- Do NOT output JSON.
- Do NOT include any other headings besides the "###" restaurant headings.`;

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
