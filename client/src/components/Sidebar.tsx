import { 
  LayoutDashboard, 
  Leaf, 
  SunMedium, 
  Menu,
  Search,
  Sprout,
  ChevronDown,
  ShieldCheck,
  MapPin,
  MessageSquare
} from "lucide-react";
import { useState, useMemo, createContext, useContext, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLocationContext } from "@/hooks/use-location-context";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { 
    label: "Gardening", 
    icon: Sprout,
    children: [
      { href: "/plants", label: "Plants", icon: Leaf },
      { href: "/garden", label: "Your Garden", icon: Sprout },
    ]
  },
  { href: "/solar", label: "Solar Calc", icon: SunMedium },
  { href: "/green-credits", label: "Green Credits", icon: ShieldCheck },
  { href: "#chat", label: "Poke Enviro", icon: MessageSquare },
];

function PokeEnviroChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversation } = useQuery({
    queryKey: ["/api/conversations"],
    select: (data: any[]) => data[0],
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/conversations", conversation?.id, "messages"],
    queryFn: async () => {
      if (!conversation?.id) return [];
      const res = await fetch(`/api/conversations/${conversation.id}`);
      const data = await res.json();
      return data.messages || [];
    },
    enabled: !!conversation?.id,
  });

  const createConversation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/conversations", { title: "Poke Enviro Chat" });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/conversations"] }),
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      let convId = conversation?.id;
      if (!convId) {
        const newConv = await createConversation.mutateAsync();
        convId = newConv.id;
      }
      return apiRequest("POST", `/api/conversations/${convId}/messages`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversation?.id, "messages"] });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessage.isPending) return;
    const msg = input.trim();
    setInput("");
    sendMessage.mutate(msg);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-start items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group overflow-hidden h-auto",
          isOpen ? "text-white bg-white/5" : "text-white/40 hover:text-white"
        )}
      >
        <MessageSquare className={cn("w-5 h-5 transition-colors", isOpen ? "text-solar-glow" : "text-white/40 group-hover:text-solar-glow")} />
        <span className="font-medium">Poke Enviro</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-full ml-4 bottom-0 w-80 h-96 bg-[#030806] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <span className="font-bold text-solar-glow">Poke Enviro</span>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsOpen(false)}>×</Button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !messagesLoading && (
                <p className="text-white/40 text-center text-xs italic">Ask me anything about the environment!</p>
              )}
              {messages.map((m: any, i: number) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    m.role === "user" ? "bg-solar-glow/20 text-white rounded-tr-none" : "bg-white/5 text-white/80 rounded-tl-none"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
              {sendMessage.isPending && (
                <div className="flex justify-start italic text-white/40 text-xs">Thinking...</div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9"
              />
              <Button type="submit" size="sm" className="bg-solar-glow text-black hover:bg-solar-glow/80 h-9">
                Send
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

// Context for sharing collapsed state
export const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}>({ collapsed: false, setCollapsed: () => {} });

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}


export function Sidebar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { collapsed, setCollapsed } = useSidebar();
  const { zipCode, setZipCode } = useLocationContext();
  const [zipInput, setZipInput] = useState(zipCode);

  const dailyTip = useMemo(() => {
    return DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
  }, []);

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipInput.trim() && zipInput.trim().length === 6) {
      setZipCode(zipInput.trim());
      queryClient.invalidateQueries({ queryKey: ['/api/environment'] });
    }
  };

  // Add auto-submit when zip code reaches 6 digits
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setZipInput(value);
    if (value.length === 6) {
      setZipCode(value);
      queryClient.invalidateQueries({ queryKey: ['/api/environment'] });
    }
  };

  const NavContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
    <div className="flex flex-col h-full py-6 bg-[#030806] border-r border-white/5">
      <div className={cn("px-6 mb-10 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setCollapsed(!collapsed)}
          data-testid="button-toggle-sidebar"
        >
          <div className="bg-solar-glow/20 p-0 rounded-xl hover:bg-solar-glow/30 transition-colors shadow-[0_0_15px_rgba(251,191,36,0.2)] overflow-hidden w-10 h-10 flex items-center justify-center">
            <img src="/logo.jpg" alt="Gen Innovators Logo" className="w-full h-full object-cover" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-display font-bold text-white tracking-tight solar-glow-text">EnviroSense</span>
          )}
        </div>
        {!isCollapsed && (
          <Button size="icon" variant="ghost" className="text-white/50 hover:text-white solar-glow-text">
            <Search className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            const isChildActive = item.children.some(child => location === child.href);
            return (
              <Collapsible
                key={item.label}
                defaultOpen={isChildActive}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group overflow-hidden h-auto",
                      isCollapsed && "justify-center px-3",
                      isChildActive ? "text-white bg-white/5" : "text-white/40 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("w-5 h-5 transition-colors", isChildActive ? "text-solar-glow drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-white/40 group-hover:text-solar-glow")} />
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </div>
                    {!isCollapsed && <ChevronDown className="w-4 h-4 opacity-50" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {item.children.map((child) => {
                    const isActive = location === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "relative flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 group overflow-hidden ml-4",
                          isCollapsed && "ml-0 justify-center",
                          isActive ? "text-white" : "text-white/40 hover:text-white"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeNavSub"
                            className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-xl solar-gradient-border"
                            initial={false}
                          />
                        )}
                        <child.icon className={cn("w-4 h-4 z-10 transition-colors", isActive ? "text-solar-glow" : "text-white/40")} />
                        {!isCollapsed && <span className="text-sm font-medium z-10">{child.label}</span>}
                      </Link>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          }

          if (item.label === "Poke Enviro") {
            return <PokeEnviroChat key={item.label} />;
          }

          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group overflow-hidden",
              isCollapsed && "justify-center px-3",
              isActive 
                ? "text-white" 
                : "text-white/40 hover:text-white"
            )} onClick={() => setOpen(false)}>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl solar-gradient-border"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 z-10 transition-colors", isActive ? "text-solar-glow drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-white/40 group-hover:text-solar-glow", item.label === "Green Credits" && "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]")} />
              {!isCollapsed && <span className={cn("font-medium z-10", item.label === "Green Credits" && "gold-shimmer")}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="px-6 pt-4 border-t border-white/5 mt-auto space-y-4">
          <form onSubmit={handleZipSubmit} className="space-y-2">
            <label className="text-xs text-white/50 uppercase tracking-wider font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Your Zip Code
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter zip code"
                value={zipInput}
                onChange={handleZipChange}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm h-9"
                data-testid="input-zip-code"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="bg-solar-glow/20 hover:bg-solar-glow/30 text-solar-glow border-none h-9 shrink-0"
                data-testid="button-save-zip"
              >
                Save
              </Button>
            </div>
            {zipCode && (
              <p className="text-[10px] text-white/40">Current: ZIP {zipCode}</p>
            )}
          </form>
          <div className="relative group overflow-hidden rounded-2xl p-4 transition-all duration-500 hover:scale-[1.02] solar-card solar-gradient-border">
             <div className="absolute inset-0 bg-gradient-to-br from-solar-glow/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
             <div className="relative z-10">
               <p className="text-sm font-display font-bold text-solar-glow opacity-90">Daily Tip</p>
               <p className="text-xs mt-2 text-white/60 leading-relaxed">{dailyTip}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside 
        className={cn(
          "hidden md:flex flex-col fixed inset-y-0 z-30 shadow-2xl transition-all duration-300",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <NavContent isCollapsed={collapsed} />
      </aside>

      <div className="md:hidden fixed top-6 left-6 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-[#0a1a14] border-white/10 rounded-xl shadow-2xl hover:bg-white/5">
              <Menu className="w-5 h-5 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 border-none bg-transparent">
            <NavContent isCollapsed={false} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
