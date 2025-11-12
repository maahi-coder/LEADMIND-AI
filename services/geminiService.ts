import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GenerateLeadsOptions, Lead } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateLeads(options: GenerateLeadsOptions): Promise<Lead[]> {
    const {
        searchQuery,
        category,
        location,
        leadCount,
        userLocation,
    } = options;

    const modelName = 'gemini-2.5-flash';
    const categoryText = category ? ` in the category of "${category}"` : '';

    const prompt = `
      Act as an expert market researcher. Your task is to find the top ${leadCount} best leads for "${searchQuery}"${categoryText} in or very close to "${location}".
      
      For each business, you MUST provide the following information in a strict JSON format.
      Your entire response must be ONLY a single JSON array of objects, with no other text, explanations, or markdown formatting.

      Each object in the array represents a single lead and must have these exact keys:
      - "name": The full business name.
      - "place": The complete street address.
      - "no": A unique identifier like a business registration number or a simple sequential number (e.g., "1", "2") if no official number is found.
      - "contact": The primary phone number. Use "N/A" if not available.
      - "website_link": The full website URL, including 'https://'. Use "N/A" if not available.
      - "opening_time": The general opening hours (e.g., "Mon-Fri 9am-5pm"). Use "N/A" if not available.
      - "rating": The average star rating as a number. Use 0 if not available.
      - "best_thing": A short, compelling, one-sentence summary highlighting the single best feature or reason why a customer should choose this business.

      Example of a single lead object:
      {
        "name": "The Green Leaf Cafe",
        "place": "123 Main St, Anytown, USA 12345",
        "no": "3",
        "contact": "(555) 123-4567",
        "website_link": "https://www.greenleafcafe.com",
        "opening_time": "Mon-Sat 8am-8pm",
        "rating": 4.7,
        "best_thing": "They are renowned for their farm-to-table organic salads and vibrant atmosphere."
      }
    `;

    const config: any = {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
    };

    if (userLocation) {
        config.toolConfig = {
            retrievalConfig: {
                latLng: {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                }
            }
        };
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config,
        });

        let jsonText = response.text.trim();
        
        // Robust cleaning of the response to extract JSON
        const jsonMatch = jsonText.match(/(\[[\s\S]*\])/);
        if (!jsonMatch) {
            console.error("No JSON array found in response:", jsonText);
            throw new Error("The AI model returned an invalid format. Please try refining your search.");
        }
        jsonText = jsonMatch[0];
        
        const parsedLeads: Lead[] = JSON.parse(jsonText);
        return parsedLeads;

    } catch (error) {
        console.error("Error calling Gemini API or parsing response:", error);
        if (error instanceof SyntaxError) {
            throw new Error("Failed to parse the model's response. The data format was incorrect.");
        }
        throw new Error("Failed to generate leads due to an API error. Please check the console for details.");
    }
}
