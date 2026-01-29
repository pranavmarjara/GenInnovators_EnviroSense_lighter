import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { CalculateSolarRequest } from "@shared/schema";

export function useSolarCalculator() {
  return useMutation({
    mutationFn: async (data: CalculateSolarRequest) => {
      const res = await fetch(api.solar.calculate.path, {
        method: api.solar.calculate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to calculate solar savings");
      return api.solar.calculate.responses[200].parse(await res.json());
    },
  });
}
