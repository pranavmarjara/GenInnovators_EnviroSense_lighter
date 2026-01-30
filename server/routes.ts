import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { registerChatRoutes } from "./replit_integrations/chat";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  registerChatRoutes(app);

  // Chat status endpoint - check if Gemini is available
  app.get("/api/chat-status", (req, res) => {
    const available = !!(process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY);
    res.json({ available });
  });

  // Simple chat endpoint for the floating chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { content, history = [] } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      const systemPrompt = `Chatbot Identity:
- Name: Poke Enviro
- Role: Environmental guidance assistant
- Personality: Calm, informative, practical, non-preachy
- Tone: Clear, neutral, supportive, decision-focused
- Audience: General users with little technical or environmental expertise

Primary Purpose:
Poke Enviro helps users understand environmental choices and features within EnviroSense. It explains concepts, clarifies recommendations, and guides users to decisions. It must NOT behave like a general-purpose chatbot.

RESPONSE SCOPE (VERY IMPORTANT):
Poke Enviro is allowed to respond ONLY to:
1. Questions related to: Solar feasibility and solar intelligence, Plant recommendations and gardening basics, "Your Garden" environmental impact (CO2/O2 estimates), AQI, air quality, heat impact, Green Credits awareness and process, Sustainability actions relevant to individuals.
2. Questions that: Ask for clarification of app features, Ask "what should I do?" type guidance, Ask "why is this recommended?" explanations.

HARD RESTRICTIONS (DO NOT VIOLATE):
- Give NO financial advice or investment predictions.
- Predict NO profits, savings guarantees, or credit values.
- Claim NO scientific precision or certifications.
- Generate NO legal advice or government confirmations.
- Act NOT as a generic AI assistant.
- Answer NO unrelated questions (politics, coding, math, etc.)

If a question is outside scope, respond with: "I'm here to help with environmental decisions and features within EnviroSense."

RESPONSE STYLE RULES:
1. Prefer interpretation over raw data.
2. Use approximate language (generally, typically, approximately).
3. Keep responses concise (3-6 sentences).
4. Avoid alarmist or preachy language.
5. Do not overclaim accuracy.`;

      const chatMessages = [
        { role: "user" as const, parts: [{ text: `SYSTEM INSTRUCTIONS: ${systemPrompt}` }] },
        ...history.map((m: { role: string; content: string }) => ({
          role: (m.role === "user" ? "user" : "model") as "user" | "model",
          parts: [{ text: m.content }],
        })),
        { role: "user" as const, parts: [{ text: content }] },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: chatMessages,
      });

      const text = response.text || "";
      res.json({ content: text, available: true });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: "Failed to get response" });
    }
  });
  
  // Environment data endpoint using Gemini
  app.get("/api/environment", async (req, res) => {
    try {
      const location = (req.query.location as string) || "Delhi, India";
      
      const prompt = `You are an environmental data assistant. Provide current estimated environmental data for ${location}. 
      
      Return ONLY a valid JSON object with these exact fields (no markdown, no explanation):
      {
        "aqi": <number between 0-500>,
        "aqiStatus": "<Good|Moderate|Unhealthy for Sensitive Groups|Unhealthy|Very Unhealthy|Hazardous>",
        "co2": <number in ppm, typically 400-450>,
        "humidity": <number percentage 0-100>,
        "temperature": <number in celsius>,
        "recommendation": "<brief weather/environment recommendation for the day>",
        "address": "<a brief formatted address string. If the location is a 6-digit number like '160015', translate it to its corresponding area in Chandigarh, e.g. 'Sector 15, Chandigarh, 160015'>"
      }
      
      Base values on typical conditions for that location and season. Return realistic values.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        res.json({
          aqi: data.aqi || 42,
          aqiStatus: data.aqiStatus || "Good",
          co2: data.co2 || 412,
          humidity: data.humidity || 49,
          temperature: data.temperature || 28,
          recommendation: data.recommendation || "Conditions are favorable for outdoor activity.",
          address: data.address || `${location}`,
          location
        });
      } else {
        res.json({
          aqi: 42,
          aqiStatus: "Good",
          co2: 412,
          humidity: 49,
          temperature: 28,
          recommendation: "Conditions are favorable for outdoor activity.",
          address: location,
          location
        });
      }
    } catch (error) {
      console.error("Environment API error:", error);
      res.json({
        aqi: 42,
        aqiStatus: "Good",
        co2: 412,
        humidity: 49,
        temperature: 28,
        recommendation: "Conditions are favorable for outdoor activity.",
        location: "Default"
      });
    }
  });

  // AQI
  app.get(api.aqi.get.path, async (req, res) => {
    const zip = req.params.zip as string;
    if (!zip) return res.status(400).json({ message: "Zip code required" });
    const data = await storage.getAqi(zip);
    res.json(data);
  });

  // Plants
  app.post(api.plants.recommend.path, async (req, res) => {
    try {
      const input = api.plants.recommend.input.parse(req.body);
      const data = await storage.getPlantRecommendations(input);
      res.json(data);
    } catch (error) {
      console.error("Plant recommendation error:", error);
      res.status(400).json({ message: "Invalid Input" });
    }
  });

  // Solar
  app.post(api.solar.calculate.path, async (req, res) => {
    try {
      const input = api.solar.calculate.input.parse(req.body);
      const result = await storage.calculateSolar(input);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid Input" });
    }
  });

  return httpServer;
}
