import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateItinerary = async (destination, startDate, endDate, interests, budget) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // UPDATED PROMPT: Added lat and lng to the location object
    // Inside your generateItinerary function:

const prompt = `You are an expert travel planner. Create a daily itinerary for a trip to ${destination} from ${startDate} to ${endDate}.
The user's interests are: ${interests}. 

CRITICAL BUDGET RULE: The total budget for this entire trip is $${budget}. 
You MUST strictly adhere to this budget:
- If the budget is $0 or extremely low, you MUST ONLY suggest 100% FREE activities (e.g., public parks, walking tours, window shopping, free temples/monuments). Absolutely NO paid entries, luxury dining, or paid transport.
- If the budget is moderate, suggest a realistic mix of affordable activities.
- If the budget is high, include premium/luxury experiences.

Return ONLY a valid JSON object with the exact following structure. Do NOT include markdown formatting.
{
  "days": [
    {
      "dayIndex": 1,
      "activities": [
        { 
          "title": "Activity Name", 
          "description": "Short description emphasizing how it fits the budget", 
          "startTime": "09:00", 
          "endTime": "11:00", 
          "location": {
            "address": "Full physical address or recognizable landmark name",
            "lat": 35.6762,
            "lng": 139.6503
          } 
        }
      ]
    }
  ]
}`;

    // UPDATED CONFIG: Force the API to output pure JSON
    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
        }
    });
    
    const responseText = result.response.text();
    
    // Keep the cleanup as a final safety net
    const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate AI itinerary.");
  }
};