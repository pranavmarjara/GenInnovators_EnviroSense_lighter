import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useAqi(zip: string | null) {
  return useQuery({
    queryKey: [api.aqi.get.path, zip],
    queryFn: async () => {
      if (!zip || zip.length < 5) return null;
      const url = buildUrl(api.aqi.get.path, { zip });
      const res = await fetch(url);
      if (res.status === 404) return null; // Handle not found gracefully
      if (!res.ok) throw new Error("Failed to fetch AQI data");
      return api.aqi.get.responses[200].parse(await res.json());
    },
    enabled: !!zip && zip.length >= 5,
  });
}
