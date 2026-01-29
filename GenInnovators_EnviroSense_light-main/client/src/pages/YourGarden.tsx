import { PageHeader } from "@/components/PageHeader";
import { useGarden } from "@/hooks/use-garden";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Droplets, Trash2, Sprout, Info, Wind, Waves } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Approximate impact data based on general plant categories
// Small herb: 1-5kg CO2, 1 person O2 relative
// Medium plant: 5-15kg CO2, 2 people O2 relative
// Tree: 20-40kg CO2, 4+ people O2 relative
const getImpactData = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('tree') || n.includes('neem') || n.includes('banyan') || n.includes('peepal')) {
    return { co2: [20, 40], oxygen: 4 };
  }
  if (n.includes('shrub') || n.includes('hibiscus') || n.includes('rose') || n.includes('aloe')) {
    return { co2: [5, 15], oxygen: 2 };
  }
  return { co2: [1, 5], oxygen: 1 };
};

export default function YourGarden() {
  const { garden, removeFromGarden } = useGarden();

  const totalImpact = garden.reduce((acc, plant) => {
    const impact = getImpactData(plant.name);
    return {
      co2Min: acc.co2Min + impact.co2[0],
      co2Max: acc.co2Max + impact.co2[1],
      oxygen: acc.oxygen + impact.oxygen
    };
  }, { co2Min: 0, co2Max: 0, oxygen: 0 });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <PageHeader 
        title="Your Garden" 
        description="Your personal collection of selected plants and herbs."
        className="solar-glow-text mb-8"
      />

      {garden.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="solar-card solar-gradient-border border-none bg-solar-glow/5 backdrop-blur-md overflow-hidden mb-8">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className="p-2 rounded-lg bg-solar-glow/20">
                <Wind className="w-5 h-5 text-solar-glow" />
              </div>
              <CardTitle className="text-xl text-white">Estimated Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-white/40 uppercase tracking-wider font-bold">Annual CO₂ Absorption</p>
                  <p className="text-3xl font-display font-bold text-solar-glow">
                    ~{totalImpact.co2Min}–{totalImpact.co2Max} <span className="text-lg">kg/year</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-white/40 uppercase tracking-wider font-bold">Oxygen Contribution</p>
                  <p className="text-3xl font-display font-bold text-white">
                    ~{totalImpact.oxygen} <span className="text-lg text-white/60">people equivalent</span>
                  </p>
                  <p className="text-xs text-white/40 italic">
                    Equivalent to the annual oxygen needs of about {totalImpact.oxygen} {totalImpact.oxygen === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/5 items-start">
                <Info className="w-4 h-4 text-solar-glow/60 shrink-0 mt-0.5" />
                <p className="text-sm text-white/50 leading-relaxed">
                  These values are approximate estimates intended to help users understand the positive environmental impact of their garden. Actual environmental impact varies based on plant age, health, climate, and care.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {garden.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center text-center text-white/20 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
          <Sprout className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg mb-4">Your garden is empty</p>
          <Link href="/plants">
            <Button variant="outline" className="border-solar-glow text-solar-glow hover:bg-solar-glow hover:text-black">
              Browse Plants
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {garden.map((plant) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="solar-card solar-gradient-border hover:bg-white/10 transition-all duration-500 flex flex-col h-full group"
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
                      size="icon" 
                      variant="ghost" 
                      onClick={() => removeFromGarden(plant.id)}
                      className="text-white/40 hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
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
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
