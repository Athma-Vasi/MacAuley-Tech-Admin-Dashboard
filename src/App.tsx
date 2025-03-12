import "./App.css";
import Sidebar from "./components/sidebar";
import { COLORS_SWATCHES } from "./constants";
import { useGlobalState } from "./hooks/useGlobalState";
import { returnThemeColors } from "./utils";

function App() {
  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { backgroundColor, textColor, tealColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  console.log("App component rendered with themeObject:", themeObject);

  return (
    <div style={{ backgroundColor, color: tealColorShade }}>
      <Sidebar />
    </div>
  );
}

export default App;
