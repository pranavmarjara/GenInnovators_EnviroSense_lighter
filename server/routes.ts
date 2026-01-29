import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

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
        "recommendation": "<brief weather/environment recommendation for the day>"
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
