import type { ReactNode } from "react";
import { createContext, useMemo, useState } from "react";

type AppContextType = {
  appName: string;
  setAppName: (value: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function AppProvider({ children }: { children: ReactNode }) {
  const [appName, setAppName] = useState("SiLapor");

  const value = useMemo(
    () => ({
      appName,
      setAppName,
    }),
    [appName],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContext, AppProvider };
