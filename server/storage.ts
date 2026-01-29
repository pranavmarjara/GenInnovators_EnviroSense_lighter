import { 
  aqiData, plants,
  type AqiData, type Plant,
  type GetPlantRecommendationsRequest, type SolarResult, type CalculateSolarRequest
} from "@shared/schema";

export interface IStorage {
  getAqi(zip: string): Promise<AqiData>;
  getPlantRecommendations(filters: GetPlantRecommendationsRequest): Promise<Plant[]>;
  calculateSolar(params: CalculateSolarRequest): Promise<SolarResult>;
}

export class MemStorage implements IStorage {
  private mockPlants: Plant[];

  constructor() {
    this.mockPlants = [
      // Low Sunlight
      { id: 1, name: "Snake Plant", sunlight: "low", watering: "rare", careIntensity: "easy", medicinalValue: "Air purification", diseaseTags: ["headache", "respiratory"] },
      { id: 2, name: "Peace Lily", sunlight: "low", watering: "moderate", careIntensity: "moderate", medicinalValue: "Stress relief", diseaseTags: ["stress", "anxiety"] },
      { id: 3, name: "ZZ Plant", sunlight: "low", watering: "rare", careIntensity: "easy", medicinalValue: "Air purification", diseaseTags: [] },
      { id: 4, name: "Cast Iron Plant", sunlight: "low", watering: "moderate", careIntensity: "easy", medicinalValue: "General well-being", diseaseTags: [] },
      { id: 5, name: "Pothos", sunlight: "low", watering: "moderate", careIntensity: "easy", medicinalValue: "Air purification", diseaseTags: [] },
      { id: 21, name: "Areca Palm", sunlight: "low", watering: "frequent", careIntensity: "moderate", medicinalValue: "Air purification", diseaseTags: [] },
      { id: 22, name: "Spider Plant", sunlight: "low", watering: "moderate", careIntensity: "easy", medicinalValue: "Respiratory health", diseaseTags: ["respiratory"] },
      { id: 23, name: "Money Tree", sunlight: "low", watering: "frequent", careIntensity: "easy", medicinalValue: "Stress relief", diseaseTags: ["stress"] },
      { id: 24, name: "Fern", sunlight: "low", watering: "frequent", careIntensity: "high", medicinalValue: "Air humidity", diseaseTags: [] },
      { id: 25, name: "Lucky Bamboo", sunlight: "low", watering: "frequent", careIntensity: "moderate", medicinalValue: "General well-being", diseaseTags: [] },

      // Moderate Sunlight
      { id: 6, name: "Aloe Vera", sunlight: "moderate", watering: "rare", careIntensity: "easy", medicinalValue: "Skin burns and digestion", diseaseTags: ["skin", "digestion"] },
      { id: 7, name: "Basil", sunlight: "moderate", watering: "frequent", careIntensity: "moderate", medicinalValue: "Anti-inflammatory", diseaseTags: ["inflammation", "digestion"] },
      { id: 8, name: "Spider Plant", sunlight: "moderate", watering: "moderate", careIntensity: "easy", medicinalValue: "Air purification", diseaseTags: [] },
      { id: 9, name: "Mint", sunlight: "moderate", watering: "frequent", careIntensity: "easy", medicinalValue: "Digestion and freshness", diseaseTags: ["digestion", "nausea"] },
      { id: 10, name: "Jade Plant", sunlight: "moderate", watering: "rare", careIntensity: "moderate", medicinalValue: "Air purification", diseaseTags: [] },
      { id: 26, name: "Curry Leaf Plant", sunlight: "moderate", watering: "moderate", careIntensity: "moderate", medicinalValue: "Digestion", diseaseTags: ["digestion"] },
      { id: 27, name: "Lemongrass", sunlight: "moderate", watering: "moderate", careIntensity: "moderate", medicinalValue: "Stress relief", diseaseTags: ["stress"] },
      { id: 28, name: "Bonsai (Herbal)", sunlight: "moderate", watering: "rare", careIntensity: "high", medicinalValue: "Stress relief", diseaseTags: ["stress"] },
      { id: 29, name: "Medicinal Cactus", sunlight: "moderate", watering: "rare", careIntensity: "high", medicinalValue: "Skin treatment", diseaseTags: ["skin"] },
      { id: 30, name: "Rubber Plant", sunlight: "moderate", watering: "moderate", careIntensity: "easy", medicinalValue: "Air purification", diseaseTags: [] },

      // High Sunlight
      { id: 11, name: "Marigold", sunlight: "high", watering: "moderate", careIntensity: "easy", medicinalValue: "Antiseptic properties", diseaseTags: ["skin", "wounds"] },
      { id: 12, name: "Hibiscus", sunlight: "high", watering: "frequent", careIntensity: "high", medicinalValue: "Hair and skin health", diseaseTags: ["skin", "hair"] },
      { id: 13, name: "Tulsi (Holy Basil)", sunlight: "high", watering: "frequent", careIntensity: "moderate", medicinalValue: "Immunity and respiratory health", diseaseTags: ["cold", "cough", "flu", "immunity"] },
      { id: 14, name: "Rosemary", sunlight: "high", watering: "moderate", careIntensity: "moderate", medicinalValue: "Memory and concentration", diseaseTags: ["memory", "stress"] },
      { id: 15, name: "Lavender", sunlight: "high", watering: "rare", careIntensity: "moderate", medicinalValue: "Sleep and relaxation", diseaseTags: ["insomnia", "stress"] },
      { id: 16, name: "Neem", sunlight: "high", watering: "rare", careIntensity: "easy", medicinalValue: "Antibacterial and skin support", diseaseTags: ["skin", "infection", "immunity"] },
      { id: 31, name: "Guava Plant", sunlight: "high", watering: "moderate", careIntensity: "moderate", medicinalValue: "Digestion", diseaseTags: ["digestion"] },
      { id: 32, name: "Giloy", sunlight: "high", watering: "moderate", careIntensity: "easy", medicinalValue: "Immunity support", diseaseTags: ["immunity", "fever"] },
      { id: 33, name: "Sunflowers", sunlight: "high", watering: "frequent", careIntensity: "easy", medicinalValue: "Nutritional seeds", diseaseTags: [] },
      { id: 34, name: "Oregano", sunlight: "high", watering: "moderate", careIntensity: "easy", medicinalValue: "Antioxidant", diseaseTags: ["cold", "infection"] },
      { id: 35, name: "Ashwagandha", sunlight: "high", watering: "rare", careIntensity: "moderate", medicinalValue: "Stress and immunity", diseaseTags: ["stress", "immunity"] },

      // Edge Cases coverage
      { id: 36, name: "High Care Desert Herb", sunlight: "high", watering: "rare", careIntensity: "high", medicinalValue: "Rare skin treatment", diseaseTags: ["skin"] },
      { id: 37, name: "Low Light Water Lily", sunlight: "low", watering: "frequent", careIntensity: "high", medicinalValue: "Air humidity", diseaseTags: [] },
      { id: 38, name: "High Sun Easy Herb", sunlight: "high", watering: "rare", careIntensity: "easy", medicinalValue: "General health", diseaseTags: [] }
    ];
  }

  async getAqi(zip: string): Promise<AqiData> {
    // Mock AQI Logic based on ZIP code
    const zipNum = parseInt(zip) || 0;
    let value = 45;
    let category = "Good";
    let color = "green";

    if (zipNum % 3 === 0) {
      value = 112;
      category = "Unhealthy for Sensitive Groups";
      color = "orange";
    } else if (zipNum % 2 === 0) {
      value = 75;
      category = "Moderate";
      color = "yellow";
    }

    // specific mock for 90210
    if (zip === "90210") {
      value = 155;
      category = "Unhealthy";
      color = "red";
    }

    return { id: 1, zip, value, category, color };
  }

  async getPlantRecommendations(filters: GetPlantRecommendationsRequest): Promise<Plant[]> {
    let results = [...this.mockPlants];

    if (filters.sunlight) {
      results = results.filter(p => p.sunlight === filters.sunlight);
    }
    if (filters.watering) {
      results = results.filter(p => p.watering === filters.watering);
    }
    if (filters.careIntensity) {
      results = results.filter(p => p.careIntensity === filters.careIntensity);
    }
    
    // Disease filtering
    if (filters.disease) {
      const diseaseLower = filters.disease.toLowerCase();
      const diseaseMatches = results.filter(p => 
        p.diseaseTags?.some(tag => tag.toLowerCase().includes(diseaseLower)) ||
        p.medicinalValue.toLowerCase().includes(diseaseLower)
      );
      
      // If disease matches found, prioritize them
      if (diseaseMatches.length > 0) {
        return diseaseMatches;
      }
      
      // Fallback: search across ALL plants for the disease if no matches within filtered set
      const allDiseaseMatches = this.mockPlants.filter(p => 
        p.diseaseTags?.some(tag => tag.toLowerCase().includes(diseaseLower)) ||
        p.medicinalValue.toLowerCase().includes(diseaseLower)
      );
      
      if (allDiseaseMatches.length > 0) {
        return allDiseaseMatches;
      }
    }

    // Final fallback: if no results after all filters, provide general medicinal fallbacks
    if (results.length === 0) {
      const fallbacks = ["Tulsi", "Neem", "Aloe Vera", "Giloy", "Mint"];
      return this.mockPlants.filter(p => fallbacks.some(f => p.name.includes(f)));
    }

    return results;
  }

  async calculateSolar(params: CalculateSolarRequest): Promise<SolarResult> {
    const { dailyKwh } = params;
    
    // Panel specs: 500W monocrystalline, ~4 sun hours avg
    const panelWatts = 500;
    const sunHoursPerDay = 4;
    const panelDailyKwh = (panelWatts / 1000) * sunHoursPerDay; // 2 kWh per panel per day
    
    // Calculate panels needed
    const panelsNeeded = Math.ceil(dailyKwh / panelDailyKwh);
    const systemSizeKw = (panelsNeeded * panelWatts) / 1000;
    const dailyProduction = panelsNeeded * panelDailyKwh;
    const energyOffsetPercent = Math.min(100, Math.round((dailyProduction / dailyKwh) * 100));
    
    // CO2 reduction: ~0.4 kg CO2 per kWh saved
    const annualKwhSaved = dailyProduction * 365;
    const annualCo2ReductionTons = Math.round((annualKwhSaved * 0.4) / 1000 * 10) / 10;
    
    // Savings: ~8 INR per kWh
    const annualSavingsInr = Math.round(annualKwhSaved * 8);
    
    // Low usage threshold
    if (dailyKwh < 5) {
      return {
        worthIt: false,
        panels: panelsNeeded,
        systemSizeKw,
        energyOffsetPercent,
        annualCo2ReductionTons,
        annualSavingsInr,
        summary: "Your energy usage is relatively low. Solar installation may not provide optimal return on investment for your current consumption patterns."
      };
    }

    return {
      worthIt: true,
      panels: panelsNeeded,
      systemSizeKw,
      energyOffsetPercent,
      annualCo2ReductionTons,
      annualSavingsInr,
      summary: "Based on your energy consumption and regional factors, solar installation is recommended for your location."
    };
  }

}

export const storage = new MemStorage();
