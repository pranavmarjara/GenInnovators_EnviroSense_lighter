import { Link } from "wouter";
import { ArrowRight, Leaf, Sun, BarChart3, Star, Wind, ShieldCheck, Sprout, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGarden } from "@/hooks/use-garden";
import { useMemo } from "react";
import forestImg from "@assets/681b154ea1cfb4dd2891b723_tmpr49wx9_r_1769716033818.jpeg";

const DAILY_TIPS = [
  "Switching off unused lights can reduce household electricity use by up to 10%.",
  "Using public transport once a week can significantly lower your carbon footprint.",
  "Reducing meat consumption by one day a week can save over 1,000 gallons of water.",
  "Carrying a reusable water bottle helps cut down plastic waste.",
  "Planting native trees improves air quality and supports local biodiversity.",
  "Shorter showers can save hundreds of litres of water every month.",
  "Air-drying clothes instead of using a dryer saves energy and extends fabric life.",
  "Segregating waste at home improves recycling efficiency and reduces landfill load.",
  "Using LED bulbs consumes up to 75% less energy than traditional bulbs.",
  "Walking or cycling short distances reduces air pollution and improves health.",
  "Regular servicing of air conditioners improves efficiency and lowers power usage.",
  "Reusing paper for rough work can significantly reduce paper waste.",
  "Keeping indoor plants can help improve air quality naturally.",
  "Buying products with minimal packaging reduces plastic pollution.",
  "Turning off taps while brushing can save up to 6 litres of water per minute.",
  "Supporting local produce reduces transportation emissions and supports farmers.",
  "Composting kitchen waste turns organic waste into useful fertilizer.",
  "Using solar energy reduces dependence on fossil fuels and lowers emissions.",
  "Avoiding single-use plastics helps protect marine and wildlife ecosystems.",
  "Setting air conditioners at 24-26C saves electricity and reduces emissions."
];

export default function Dashboard() {
  const { garden } = useGarden();
  
  const dailyTip = useMemo(() => {
    return DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
  }, []);

  const getImpactData = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('tree') || n.includes('neem') || n.includes('banyan') || n.includes('peepal')) {
      return { co2: [20, 40] };
    }
    if (n.includes('shrub') || n.includes('hibiscus') || n.includes('rose') || n.includes('aloe')) {
      return { co2: [5, 15] };
    }
    return { co2: [1, 5] };
  };

  const totalImpact = garden.reduce((acc, plant) => {
    const impact = getImpactData(plant.name);
    return {
      min: acc.min + impact.co2[0],
      max: acc.max + impact.co2[1]
    };
  }, { min: 0, max: 0 });

  return (
    <div className="w-full h-full space-y-12 pb-12 relative min-h-screen">
      <div className="relative z-10 space-y-12">
        {/* Dashboard Header */}
        <header>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 solar-glow-text">
            Your Environmental Snapshot
          </h1>
          <p className="text-white/40 text-lg">
            Based on your location and current selections
          </p>
        </header>

        {/* Today's Environment Section */}
        <section>
          <Card className="solar-card solar-gradient-border border-none bg-white/5 backdrop-blur-md overflow-hidden p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-display font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-solar-glow/20">
                  <Wind className="w-6 h-6 text-solar-glow" />
                </div>
                Today's Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="space-y-1">
                  <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Air Quality Index</p>
                  <p className="text-3xl font-display font-bold text-solar-glow">42 <span className="text-sm text-white/60">Good</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Estimated CO₂</p>
                  <p className="text-3xl font-display font-bold text-white">412 <span className="text-sm text-white/60">ppm</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Local Humidity</p>
                  <p className="text-3xl font-display font-bold text-white">49%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                <Info className="w-4 h-4 text-solar-glow" />
                <p className="text-white/70">Conditions today are favorable for outdoor activity and solar generation.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Core Action Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Solar Status */}
          <Card className="solar-card solar-gradient-border border-none bg-white/5 hover-elevate group">
            <CardHeader className="pb-4">
              <div className="p-3 rounded-xl bg-solar-glow/10 w-fit mb-4 group-hover:bg-solar-glow group-hover:text-black transition-colors">
                <Sun className="w-6 h-6 text-solar-glow group-hover:text-inherit" />
              </div>
              <CardTitle className="text-xl text-white">Solar Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-white/60 leading-relaxed">Solar installation is recommended for your region</p>
                <p className="text-lg font-bold text-solar-glow">Estimated energy offset: ~70–80%</p>
              </div>
              <Link href="/solar">
                <Button className="w-full bg-white/5 border border-white/10 hover:border-solar-glow/50 text-white hover:text-solar-glow rounded-xl font-bold py-6 h-auto transition-all">
                  View Solar Intelligence
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Your Garden */}
          <Card className="solar-card solar-gradient-border border-none bg-white/5 hover-elevate group">
            <CardHeader className="pb-4">
              <div className="p-3 rounded-xl bg-solar-glow/10 w-fit mb-4 group-hover:bg-solar-glow group-hover:text-black transition-colors">
                <Sprout className="w-6 h-6 text-solar-glow group-hover:text-inherit" />
              </div>
              <CardTitle className="text-xl text-white">Your Garden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-white/60 leading-relaxed">Plants selected: {garden.length}</p>
                <p className="text-lg font-bold text-solar-glow">
                  CO₂ absorption: ~{totalImpact.min}–{totalImpact.max} <span className="text-sm">kg/year</span>
                </p>
              </div>
              <Link href="/garden">
                <Button className="w-full bg-white/5 border border-white/10 hover:border-solar-glow/50 text-white hover:text-solar-glow rounded-xl font-bold py-6 h-auto transition-all">
                  View Your Garden
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Green Credits */}
          <Card className="solar-card solar-gradient-border border-none bg-white/5 hover-elevate group">
            <CardHeader className="pb-4">
              <div className="p-3 rounded-xl bg-solar-glow/10 w-fit mb-4 group-hover:bg-solar-glow group-hover:text-black transition-colors">
                <ShieldCheck className="w-6 h-6 text-solar-glow group-hover:text-inherit" />
              </div>
              <CardTitle className="text-xl text-white">Green Credits Awareness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-white/60 leading-relaxed">Eligible environmental actions identified</p>
                <p className="text-lg font-bold text-solar-glow">Learn how citizens can participate</p>
              </div>
              <Link href="/green-credits">
                <Button className="w-full bg-white/5 border border-white/10 hover:border-solar-glow/50 text-white hover:text-solar-glow rounded-xl font-bold py-6 h-auto transition-all">
                  Explore Green Credits
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* What You Can Do Next Section */}
        <section className="space-y-6">
          <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3 px-2">
            What You Can Do Next
          </h3>
          <div className="grid grid-cols-1 gap-4 px-2">
            {[
              { label: "Check if solar is worth it for your home", href: "/solar" },
              { label: "Choose plants suited to your lifestyle", href: "/plants" },
              { label: "Understand how Green Credits work", href: "/green-credits" }
            ].map((item, i) => (
              <Link key={i} href={item.href}>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-solar-glow/20 hover:bg-white/10 transition-all cursor-pointer group">
                  <span className="text-white/70 group-hover:text-white transition-colors">{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-solar-glow transition-all group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Small Actions Section (Daily Tip) */}
        <section className="pt-12 border-t border-white/5">
          <h3 className="text-sm font-bold text-solar-glow uppercase tracking-[0.3em] mb-6 px-2">
            Small Actions, Real Impact
          </h3>
          <div className="mx-2 p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-solar-glow/5 to-transparent opacity-50" />
            <div className="relative z-10 flex gap-4 items-start">
              <Star className="w-5 h-5 text-solar-glow shrink-0 mt-0.5" />
              <p className="text-white/60 leading-relaxed italic italic">"{dailyTip}"</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
