import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppContext.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
