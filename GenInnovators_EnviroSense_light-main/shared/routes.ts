import { z } from 'zod';
import { 
  getAqiSchema, 
  getPlantRecommendationsSchema, 
  calculateSolarSchema, 
  aqiData,
  plants
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  aqi: {
    get: {
      method: 'GET' as const,
      path: '/api/aqi/:zip',
      responses: {
        200: z.custom<typeof aqiData.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  plants: {
    recommend: {
      method: 'POST' as const, // Using POST for complex filter body
      path: '/api/plants/recommend',
      input: getPlantRecommendationsSchema,
      responses: {
        200: z.array(z.custom<typeof plants.$inferSelect>()),
      },
    },
  },
  solar: {
    calculate: {
      method: 'POST' as const,
      path: '/api/solar/calculate',
      input: calculateSolarSchema,
      responses: {
        200: z.object({
          worthIt: z.boolean(),
          panels: z.number(),
          systemSizeKw: z.number(),
          energyOffsetPercent: z.number(),
          annualCo2ReductionTons: z.number(),
          annualSavingsInr: z.number(),
          summary: z.string(),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
