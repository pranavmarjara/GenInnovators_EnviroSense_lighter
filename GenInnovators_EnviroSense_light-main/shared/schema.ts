import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We will mostly use in-memory mock data, but defining schemas ensures type safety

// === AQI Data ===
export const aqiData = pgTable("aqi_data", {
  id: serial("id").primaryKey(),
  zip: text("zip").notNull(),
  value: integer("value").notNull(),
  category: text("category").notNull(), // Good, Moderate, Poor
  color: text("color").notNull(), // green, yellow, red
});

// === Plant Recommendations ===
export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sunlight: text("sunlight").notNull(), // low, moderate, high
  watering: text("watering").notNull(), // rare, moderate, frequent
  careIntensity: text("care_intensity").notNull(), // easy, moderate, high
  medicinalValue: text("medicinal_value").notNull(),
  diseaseTags: text("disease_tags").array(), // For filtering by disease
});

// === Schemas ===
export const insertAqiSchema = createInsertSchema(aqiData);
export const insertPlantSchema = createInsertSchema(plants);

// === Type Exports ===
export type AqiData = typeof aqiData.$inferSelect;
export type Plant = typeof plants.$inferSelect;

// === API Request/Response Types ===

// AQI
export const getAqiSchema = z.object({
  zip: z.string().min(5),
});
export type GetAqiRequest = z.infer<typeof getAqiSchema>;

// Plants
export const getPlantRecommendationsSchema = z.object({
  sunlight: z.enum(["low", "moderate", "high"]).optional(),
  watering: z.enum(["rare", "moderate", "frequent"]).optional(),
  careIntensity: z.enum(["easy", "moderate", "high"]).optional(),
  disease: z.string().optional(),
});
export type GetPlantRecommendationsRequest = z.infer<typeof getPlantRecommendationsSchema>;

// Solar
export const calculateSolarSchema = z.object({
  zip: z.string(),
  dailyKwh: z.coerce.number().min(0),
});
export type CalculateSolarRequest = z.infer<typeof calculateSolarSchema>;

export type SolarResult = {
  worthIt: boolean;
  panels: number;
  systemSizeKw: number;
  energyOffsetPercent: number;
  annualCo2ReductionTons: number;
  annualSavingsInr: number;
  summary: string;
};

