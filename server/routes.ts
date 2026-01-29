import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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
