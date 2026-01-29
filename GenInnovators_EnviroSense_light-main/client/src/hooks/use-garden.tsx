import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type Plant } from "@shared/schema";

interface GardenContextType {
  garden: Plant[];
  addToGarden: (plant: Plant) => void;
  removeFromGarden: (plantId: number) => void;
  isInGarden: (plantId: number) => boolean;
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

export function GardenProvider({ children }: { children: ReactNode }) {
  const [garden, setGarden] = useState<Plant[]>(() => {
    const saved = localStorage.getItem("envirosense_garden");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("envirosense_garden", JSON.stringify(garden));
  }, [garden]);

  const addToGarden = (plant: Plant) => {
    setGarden((prev) => [...prev, plant]);
  };

  const removeFromGarden = (plantId: number) => {
    setGarden((prev) => prev.filter((p) => p.id !== plantId));
  };

  const isInGarden = (plantId: number) => {
    return garden.some((p) => p.id === plantId);
  };

  return (
    <GardenContext.Provider value={{ garden, addToGarden, removeFromGarden, isInGarden }}>
      {children}
    </GardenContext.Provider>
  );
}

export function useGarden() {
  const context = useContext(GardenContext);
  if (context === undefined) {
    throw new Error("useGarden must be used within a GardenProvider");
  }
  return context;
}
