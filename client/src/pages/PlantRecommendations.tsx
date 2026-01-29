import { PageHeader } from "@/components/PageHeader";
import { usePlantRecommendations } from "@/hooks/use-plants";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPlantRecommendationsSchema, type GetPlantRecommendationsRequest } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sprout, Droplets, Sun, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useGarden } from "@/hooks/use-garden";
import { cn } from "@/lib/utils";

export default function PlantRecommendations() {
  const { mutate, isPending, data: plants } = usePlantRecommendations();
  const [hasSearched, setHasSearched] = useState(false);
  const { addToGarden, removeFromGarden, isInGarden } = useGarden();

  const form = useForm<GetPlantRecommendationsRequest>({
    resolver: zodResolver(getPlantRecommendationsSchema),
    defaultValues: {
      sunlight: "moderate",
      watering: "moderate",
      careIntensity: "easy",
      disease: "",
    },
  });

  const onSubmit = (data: GetPlantRecommendationsRequest) => {
    mutate(data);
    setHasSearched(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader 
        title="Plant Recommendations" 
        description="Discover the perfect plants for your environment based on sunlight, water, and care requirements."
        className="solar-glow-text mb-8"
      />

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Panel */}
        <div className="lg:col-span-1">
          <div className="solar-card solar-gradient-border p-6 shadow-2xl sticky top-8">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2 solar-glow-text">
              <Sprout className="w-5 h-5 text-solar-glow" /> 
              Filters
            </h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="sunlight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60">Sunlight Requirement</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 rounded-xl focus:ring-solar-glow/50">
                            <SelectValue placeholder="Select sunlight" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#030806] border-white/10">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="watering"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60">Water Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 rounded-xl focus:ring-solar-glow/50">
                            <SelectValue placeholder="Select watering" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#030806] border-white/10">
                          <SelectItem value="rare">Rare</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="frequent">Frequent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="careIntensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60">Care Intensity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 rounded-xl focus:ring-solar-glow/50">
                            <SelectValue placeholder="Select care level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#030806] border-white/10">
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disease"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60">Ailment / Disease (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. digestion, cold" {...field} className="bg-white/5 border-white/10 rounded-xl focus:ring-solar-glow/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full rounded-xl bg-gradient-to-r from-solar-glow to-amber-500 hover:from-amber-500 hover:to-solar-glow text-black font-bold py-6 shadow-lg transition-all"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : "Find Plants"}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {!hasSearched && (
            <div className="h-96 flex flex-col items-center justify-center text-center text-white/20 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
              <Sprout className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Select filters to see plant recommendations</p>
            </div>
          )}

          {hasSearched && isPending && (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-solar-glow animate-spin" />
              <p className="text-solar-glow/80 animate-pulse font-medium">Cultivating recommendations...</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {plants?.map((plant, idx) => {
                const isSelected = isInGarden(plant.id);
                return (
                  <motion.div
                    key={plant.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="solar-card solar-gradient-border hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full group"
                  >
                    <div className="p-5 flex-1 flex flex-col relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-display font-bold text-xl text-white mb-1 group-hover:text-solar-glow transition-colors">{plant.name}</h3>
                          <Badge variant="outline" className="bg-black/60 backdrop-blur-md border-white/10 text-white shadow-xl mt-2">
                            {plant.careIntensity} Care
                          </Badge>
                        </div>
                        <Button 
                          size="sm" 
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "rounded-full transition-all duration-300",
                            isSelected ? "bg-solar-glow text-black" : "border-white/20 text-white/40 hover:text-solar-glow hover:border-solar-glow"
                          )}
                          onClick={() => isSelected ? removeFromGarden(plant.id) : addToGarden(plant)}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Sun className="w-4 h-4 text-solar-glow" />
                          <span className="capitalize">Sunlight: {plant.sunlight}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Droplets className="w-4 h-4 text-blue-400" />
                          <span className="capitalize">Water: {plant.watering}</span>
                        </div>
                        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                          <p className="text-xs font-bold text-solar-glow uppercase tracking-wider mb-1">Medicinal Value</p>
                          <p className="text-sm text-white/80 leading-relaxed">{plant.medicinalValue}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {hasSearched && plants?.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No plants found for these criteria. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
