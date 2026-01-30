import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Pages
import HomePage from "@/pages/HomePage";
import WidgetOSPage from "@/pages/WidgetOSPage";
import FusionOSPage from "@/pages/FusionOSPage";
import UpdaterPage from "@/pages/UpdaterPage";
import WifiConfigPage from "@/pages/WifiConfigPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/widget-os" element={<WidgetOSPage />} />
          <Route path="/widget-os/:boardSize" element={<UpdaterPage />} />
          <Route path="/widget-os/wifi-config" element={<WifiConfigPage />} />
          <Route path="/fusion-os" element={<FusionOSPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="bottom-right" 
        theme="dark"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fafafa'
          }
        }}
      />
    </div>
  );
}

export default App;
