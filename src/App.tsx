import "./App.css";
import DashboardWrapper from "./components/dashboard";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { COLORS_SWATCHES } from "./constants";
import { useGlobalState } from "./hooks/useGlobalState";
import { returnThemeColors } from "./utils";

function App() {
  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { backgroundColor, textColor } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  console.log("App component rendered with themeObject:", themeObject);

  return (
    <div className="app" style={{ backgroundColor, color: textColor }}>
      <Header />
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main">
        <h2>Main content</h2>
        <DashboardWrapper />
      </div>
    </div>
  );
}

export default App;
