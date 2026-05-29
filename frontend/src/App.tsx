import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppContext.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";
import InstallBanner from "./components/ui/InstallBanner.tsx";

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
        <InstallBanner />
      </Router>
    </AppProvider>
  );
}

export default App;
