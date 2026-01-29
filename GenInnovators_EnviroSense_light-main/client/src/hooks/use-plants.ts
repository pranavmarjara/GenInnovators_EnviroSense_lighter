import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { GetPlantRecommendationsRequest } from "@shared/schema";

export function usePlantRecommendations() {
  return useMutation({
    mutationFn: async (data: GetPlantRecommendationsRequest) => {
      const res = await fetch(api.plants.recommend.path, {
        method: api.plants.recommend.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to fetch plant recommendations");
      return api.plants.recommend.responses[200].parse(await res.json());
    },
  });
}
