import { PageHeader } from "@/components/PageHeader";
import { useSolarCalculator } from "@/hooks/use-solar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateSolarSchema, type CalculateSolarRequest } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sun, Wind, MapPin, Zap, CheckCircle2, AlertTriangle, TrendingUp, Wallet, Leaf, Info, Settings, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function SolarCalculator() {
  const { mutate, isPending, data: result } = useSolarCalculator();

  const form = useForm<CalculateSolarRequest>({
    resolver: zodResolver(calculateSolarSchema),
    defaultValues: {
      zip: "90210",
      dailyKwh: 25,
    },
  });

  const onSubmit = (data: CalculateSolarRequest) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#030806] text-white p-4 md:p-8 font-display">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight solar-glow-text">
              Solar Intelligence
            </h1>
            <p className="text-white/60 text-lg">
              Make smarter energy decisions for your location
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
              <Sun className="w-5 h-5 text-solar-glow" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40">Sunlight: High</p>
                <TrendingUp className="w-3 h-3 text-solar-glow" />
              </div>
            </div>
            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
              <Wind className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40">AQI Impact:</p>
                <p className="text-xs font-semibold">Low Loss</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40">Region:</p>
                <p className="text-xs font-semibold text-emerald-400">Favorable</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 solar-card solar-gradient-border p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-solar-glow" />
              <h2 className="text-xl font-bold">Energy Profile</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-xs uppercase tracking-widest">ZIP Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="90210" 
                          {...field} 
                          className="bg-black/40 border-white/10 h-12 rounded-xl focus:ring-solar-glow/50" 
                          data-testid="input-zip"
                        />
                      </FormControl>
                      <p className="text-[10px] text-white/40">Used to determine sunlight & AQI</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyKwh"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel className="text-white/60 text-xs uppercase tracking-widest">Daily Load (kWh)</FormLabel>
                        <span className="text-solar-glow font-bold">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={1}
                          max={50}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-4"
                          data-testid="slider-daily-kwh"
                        />
                      </FormControl>
                      <div className="flex justify-between text-[10px] text-white/40">
                        <span>1</span>
                        <span>50</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-solar-glow to-amber-500 hover:from-amber-500 hover:to-solar-glow text-black font-bold text-lg shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all duration-500 group overflow-hidden relative"
                  data-testid="button-analyze-solar"
                >
                  {isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <span className="inline-block transition-all duration-300 transform group-hover:scale-95 whitespace-nowrap overflow-hidden text-ellipsis px-2 max-w-full text-[clamp(0.75rem,2.5cqi,1.125rem)]">
                      Analyze Solar
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div className="lg:col-span-8 solar-card solar-gradient-border p-8 min-h-[500px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!result && !isPending && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                    <Sun className="w-10 h-10 text-white/20" />
                  </div>
                  <p className="text-white/40">Adjust parameters and analyze to see your Solar Intelligence Report</p>
                </motion.div>
              )}

              {isPending && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center gap-4"
                >
                  <Loader2 className="w-12 h-12 text-solar-glow animate-spin" />
                  <p className="text-solar-glow/80 animate-pulse font-medium">Computing solar potential...</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border",
                      result.worthIt 
                        ? "bg-emerald-500/10 border-emerald-500/30" 
                        : "bg-amber-500/10 border-amber-500/30"
                    )}
                    data-testid="text-solar-verdict"
                  >
                    {result.worthIt ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className={cn(
                        "font-bold text-lg",
                        result.worthIt ? "text-emerald-400" : "text-amber-400"
                      )}>
                        {result.worthIt 
                          ? "Solar installation is recommended for your location" 
                          : "Solar installation is not optimal for your location"}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 rounded-xl p-5 border border-white/10"
                  >
                    <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sun className="w-4 h-4 text-solar-glow" />
                      Recommended Solar System
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold solar-glow-text" data-testid="text-panels-count">{result.panels}</p>
                        <p className="text-xs text-white/50 mt-1">Panels</p>
                      </div>
                      <div className="text-center border-x border-white/10">
                        <p className="text-3xl font-bold solar-glow-text" data-testid="text-system-size">{result.systemSizeKw}</p>
                        <p className="text-xs text-white/50 mt-1">kW System</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold solar-glow-text" data-testid="text-energy-offset">~{result.energyOffsetPercent}%</p>
                        <p className="text-xs text-white/50 mt-1">Energy Offset</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 rounded-xl p-5 border border-white/10"
                  >
                    <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-white/60" />
                      Panel Specifications
                    </h3>
                    <p className="text-[10px] text-white/40 mb-3">Standard reference specifications (not brand-specific)</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-white/40 text-[10px] uppercase">Type</p>
                        <p className="font-medium text-white/90">Monocrystalline</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-white/40 text-[10px] uppercase">Power</p>
                        <p className="font-medium text-white/90">~500 W</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-white/40 text-[10px] uppercase">Efficiency</p>
                        <p className="font-medium text-white/90">~20%</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-white/40 text-[10px] uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> Lifespan</p>
                        <p className="font-medium text-white/90">25 years</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-white/40 text-[10px] uppercase">Maintenance</p>
                        <p className="font-medium text-white/90">Low</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/5 rounded-xl p-5 border border-white/10"
                  >
                    <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-400" />
                      Why This Recommendation
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      This recommendation is based on your region's sunlight availability, air quality impact on panel efficiency, and your average daily energy usage of {form.getValues("dailyKwh")} kWh.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="bg-emerald-500/10 rounded-xl p-5 border border-emerald-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Leaf className="w-5 h-5 text-emerald-400" />
                        <p className="text-white/50 text-xs uppercase tracking-wider">Annual CO2 Reduction</p>
                      </div>
                      <p className="text-2xl font-bold text-emerald-400" data-testid="text-co2-reduction">~{result.annualCo2ReductionTons} tons</p>
                    </div>
                    <div className="bg-solar-glow/10 rounded-xl p-5 border border-solar-glow/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Wallet className="w-5 h-5 text-solar-glow" />
                        <p className="text-white/50 text-xs uppercase tracking-wider">Annual Savings</p>
                      </div>
                      <p className="text-2xl font-bold text-solar-glow" data-testid="text-annual-savings">{result.annualSavingsInr.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })} / year</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,transparent_70%)] pointer-events-none -z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
