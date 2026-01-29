import { motion } from "framer-motion";
import { 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  TreePine, 
  Droplets, 
  Recycle, 
  Sprout, 
  Wind, 
  Waves,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    title: "Step 1: Register the Activity",
    description: "Individuals or groups must register their proposed environmental activity on the official Green Credit Programme portal.",
    details: "The activity is logged for tracking and verification."
  },
  {
    title: "Step 2: Choose an Eligible Environmental Action",
    description: "Select from recognized categories based on government guidelines.",
    items: [
      { text: "Tree plantation and afforestation", icon: TreePine },
      { text: "Water conservation and watershed activities", icon: Droplets },
      { text: "Waste management and recycling initiatives", icon: Recycle },
      { text: "Sustainable agriculture and land-use practices", icon: Sprout },
      { text: "Air pollution reduction activities", icon: Wind },
      { text: "Mangrove conservation and restoration", icon: Waves }
    ]
  },
  {
    title: "Step 3: Perform the Environmental Action",
    description: "The registered activity must be carried out in the real world.",
    details: "Actions should be measurable, documented, and verifiable.",
    example: "Example (Tree Plantation): Plantation of native trees on owned or permitted land (for example, 20 trees), along with basic documentation and a survival plan."
  },
  {
    title: "Step 4: Verification by Designated Authority",
    description: "Completed activities are verified by the designated authority or agency under the Green Credit Programme.",
    details: "Credits are issued only after successful verification."
  },
  {
    title: "Step 5: Issuance and Registry",
    description: "Verified Green Credits are recorded in an official digital registry managed by the programme administrator.",
    details: "Credits are tracked for transparency and accountability."
  }
];

const FEATURES = [
  {
    title: "Plant Recommendations",
    description: "Choose region-appropriate trees for plantation-based actions.",
    icon: TreePine
  },
  {
    title: "Your Garden",
    description: "Plan and organize tree plantation efforts efficiently.",
    icon: Sprout
  },
  {
    title: "Solar Intelligence",
    description: "Promote renewable energy awareness as part of sustainability goals.",
    icon: Wind
  },
  {
    title: "AQI & Heat Insights",
    description: "Understand the local environmental need for your actions.",
    icon: Wind
  }
];

export default function GreenCredits() {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 md:p-12 solar-card solar-gradient-border"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-solar-glow/10 to-transparent opacity-50" />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Green <span className="text-solar-glow">Credits</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            Green Credits are a government-backed incentive mechanism introduced in India to recognize and encourage verified environmental actions such as tree plantation, water conservation, and waste management.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-solar-glow text-black hover:bg-solar-glow/90 font-bold rounded-xl px-6 py-6 h-auto">
              Learn More
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Awareness Flow */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-solar-glow/20">
            <Info className="w-5 h-5 text-solar-glow" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">How Green Credits Are Earned</h2>
        </div>

        <div className="grid gap-6">
          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="solar-card solar-gradient-border border-none bg-white/5 backdrop-blur-md overflow-hidden hover-elevate group">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-solar-glow/10 border border-solar-glow/20 flex items-center justify-center text-solar-glow font-bold text-lg group-hover:bg-solar-glow group-hover:text-black transition-colors">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-white group-hover:text-solar-glow transition-colors">{step.title}</CardTitle>
                    <CardDescription className="text-white/60 mt-2 text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="ml-14 pb-6 space-y-4">
                  {step.details && (
                    <p className="text-sm text-white/40 italic flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-solar-glow/40" />
                      {step.details}
                    </p>
                  )}
                  {step.items && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {step.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group/item hover:border-solar-glow/50 transition-colors">
                          <item.icon className="w-4 h-4 text-solar-glow" />
                          <span className="text-sm text-white/70">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {step.example && (
                    <div className="mt-4 p-4 rounded-xl bg-solar-glow/5 border border-solar-glow/10">
                      <p className="text-sm text-white/80 leading-relaxed">
                        <span className="text-solar-glow font-bold">Example:</span> {step.example.split(': ')[1]}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-white/30 text-center italic">* Indicative categories based on government guidelines</p>
      </section>

      {/* EnviroSense Support */}
      <section className="relative overflow-hidden rounded-3xl p-8 solar-card bg-solar-glow/5 border-solar-glow/20 border">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-4 rounded-2xl bg-solar-glow/20 shrink-0">
            <ShieldCheck className="w-12 h-12 text-solar-glow" />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-display font-bold text-white">How EnviroSense Supports This Process</h3>
            <p className="text-white/70 leading-relaxed">
              EnviroSense does not generate, issue, or trade Green Credits. The platform helps users understand eligibility, identify suitable environmental actions for their location, and prepare for participation in government-recognized sustainability initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="pt-12 border-t border-white/5">
        <div className="p-6 rounded-2xl bg-white/5 flex gap-4 items-start">
          <Info className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
          <p className="text-sm text-white/40 leading-relaxed">
            <span className="font-bold text-white/60 uppercase tracking-wider text-xs block mb-1">Disclaimer</span>
            Eligibility criteria, verification processes, and credit allocation are governed by official government rules and may evolve over time. Users should refer to official government sources for the latest information.
          </p>
        </div>
      </footer>
    </div>
  );
}
