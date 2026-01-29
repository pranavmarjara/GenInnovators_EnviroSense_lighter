import { createContext, useContext, useState, useEffect } from "react";

interface LocationContextType {
  zipCode: string;
  setZipCode: (zip: string) => void;
  location: string;
}

const LocationContext = createContext<LocationContextType>({
  zipCode: "",
  setZipCode: () => {},
  location: "Delhi, India",
});

export function useLocationContext() {
  return useContext(LocationContext);
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [zipCode, setZipCodeState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userZipCode") || "";
    }
    return "";
  });

  const setZipCode = (zip: string) => {
    setZipCodeState(zip);
    if (typeof window !== "undefined") {
      localStorage.setItem("userZipCode", zip);
    }
  };

  const location = zipCode ? `ZIP ${zipCode}, India` : "Delhi, India";

  return (
    <LocationContext.Provider value={{ zipCode, setZipCode, location }}>
      {children}
    </LocationContext.Provider>
  );
}
