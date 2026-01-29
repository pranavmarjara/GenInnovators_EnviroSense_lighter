import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wind, Info, Droplets, Gauge } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FloatingAqiWidget() {
  const [aqi, setAqi] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("Loading...");
  const [color, setColor] = useState<string>("bg-gray-500");
  const [co2, setCo2] = useState<number>(412);
  const [humidity, setHumidity] = useState<number>(45);

  useEffect(() => {
    // Simulated data for the demonstration
    const timer = setTimeout(() => {
      const mockAqi = 42;
      setAqi(mockAqi);
      if (mockAqi <= 50) {
        setStatus("Good");
        setColor("bg-emerald-500");
      } else if (mockAqi <= 100) {
        setStatus("Moderate");
        setColor("bg-yellow-500");
      } else {
        setStatus("Unhealthy");
        setColor("bg-red-500");
      }
      setCo2(400 + Math.floor(Math.random() * 50));
      setHumidity(40 + Math.floor(Math.random() * 20));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
              <p className="text-xs">Real-time Environment Data</p>
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
