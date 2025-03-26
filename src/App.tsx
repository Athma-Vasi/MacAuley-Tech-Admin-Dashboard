import { MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import CustomFonts from "./components/customFonts";
import Dashboard from "./components/dashboard/Dashboard";

import DisplayResponsiveChartWrapper from "./components/charts/display";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import { useGlobalState } from "./hooks/useGlobalState";

function App() {
  const {
    globalState: { themeObject },
  } = useGlobalState();

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={themeObject}>
      <CustomFonts />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="dashboard" element={<Dashboard />}>
            <Route path=":metricsView" element={<Dashboard />} />
          </Route>

          <Route
            path="chart/:chartHeading"
            element={<DisplayResponsiveChartWrapper />}
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
