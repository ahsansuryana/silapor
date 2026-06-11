import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppContext.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";
import InstallBanner from "./components/ui/InstallBanner.tsx";
import PwaUpdater from "./components/ui/PwaUpdater.tsx";

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
        <InstallBanner />
        <PwaUpdater />
      </Router>
    </AppProvider>
  );
}

export default App;
