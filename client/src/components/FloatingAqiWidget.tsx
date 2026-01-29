import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wind, Info, Droplets, Gauge } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";

interface EnvironmentData {
  aqi: number;
  aqiStatus: string;
  co2: number;
  humidity: number;
  temperature: number;
  recommendation: string;
  location: string;
}

export function FloatingAqiWidget() {
  const { data, isLoading } = useQuery<EnvironmentData>({
    queryKey: ['/api/environment'],
    refetchInterval: 300000,
  });

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "bg-emerald-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    return "bg-red-500";
  };

  const aqi = data?.aqi ?? null;
  const status = isLoading ? "Loading..." : (data?.aqiStatus || "Good");
  const color = aqi ? getAqiColor(aqi) : "bg-gray-500";
  const co2 = data?.co2 ?? 412;
  const humidity = data?.humidity ?? 45;

  return (
    <div className="fixed top-6 right-6 z-[100] pointer-events-auto">
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="bg-[#0f2a20]/80 backdrop-blur-md border-[#1a3a2e] p-3 flex items-center gap-4 shadow-2xl hover:bg-[#1a3a2e]/90 transition-all duration-300 cursor-help">
            <div className="flex items-center gap-3 pr-3 border-r border-white/10">
              <div className={`p-2 rounded-full ${color}/20 text-white`}>
                <Wind className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">AQI</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white leading-none">
                    {aqi !== null ? aqi : "--"}
                  </span>
                  <Badge variant="outline" className={`text-[10px] h-4 px-1.5 border-none ${color} text-white`}>
                    {status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold flex items-center gap-1">
                  <Gauge className="w-2.5 h-2.5" /> CO2
                </span>
                <span className="text-sm font-bold text-white">{co2} <span className="text-[10px] font-normal text-white/40">ppm</span></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold flex items-center gap-1">
                  <Droplets className="w-2.5 h-2.5" /> Humid
                </span>
                <span className="text-sm font-bold text-white">{humidity}%</span>
              </div>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-[#0f2a20] border-[#1a3a2e] text-white">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-3 h-3 text-primary" />
              <p className="text-xs">Real-time Environment Data (AI-powered)</p>
            </div>
            <p className="text-[10px] text-white/60">AQI: Air Quality Index</p>
            <p className="text-[10px] text-white/60">CO2: Carbon Dioxide Density</p>
            <p className="text-[10px] text-white/60">Humidity: Relative Air Humidity</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
