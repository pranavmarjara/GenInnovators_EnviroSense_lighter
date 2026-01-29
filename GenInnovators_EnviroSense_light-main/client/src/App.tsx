import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar, SidebarProvider, useSidebar } from "@/components/Sidebar";
import { FloatingAqiWidget } from "@/components/FloatingAqiWidget";
import { cn } from "@/lib/utils";

// Pages
import Dashboard from "@/pages/Dashboard";
import PlantRecommendations from "@/pages/PlantRecommendations";
import YourGarden from "@/pages/YourGarden";
import SolarCalculator from "@/pages/SolarCalculator";
import GreenCredits from "@/pages/GreenCredits";
import NotFound from "@/pages/NotFound";
import { GardenProvider } from "@/hooks/use-garden";
import forestImg from "@assets/681b154ea1cfb4dd2891b723_tmpr49wx9_r_1769716033818.jpeg";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/plants" component={PlantRecommendations} />
      <Route path="/garden" component={YourGarden} />
      <Route path="/solar" component={SolarCalculator} />
      <Route path="/green-credits" component={GreenCredits} />
      <Route component={NotFound} />
    </Switch>
  );
}

function MainContent() {
  const { collapsed } = useSidebar();
  
  return (
    <main className={cn(
      "flex-1 relative z-10 transition-all duration-300",
      collapsed ? "md:ml-20" : "md:ml-72"
    )}>
      <div className="container mx-auto p-6 md:p-12 pt-24 md:pt-12 min-h-screen">
        <Router />
      </div>
    </main>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GardenProvider>
          <SidebarProvider>
            <div className="flex min-h-screen bg-black text-white font-body selection:bg-primary/20 overflow-x-hidden relative">
              {/* Global Background Layer */}
              <div 
                className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${forestImg})` }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
              </div>
              
              <FloatingAqiWidget />
              <Sidebar />
              <MainContent />
            </div>
          </SidebarProvider>
        </GardenProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
