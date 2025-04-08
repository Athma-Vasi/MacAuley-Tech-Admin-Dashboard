import { MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import CustomFonts from "./components/customFonts";
import Dashboard from "./components/dashboard/Dashboard";

import DisplayResponsiveChartWrapper from "./components/charts/display";
import DirectoryWrapper from "./components/directory";
import HomeWrapper from "./components/home";
import LoginWrapper from "./components/login";
import RegisterWrapper from "./components/register";
import { useGlobalState } from "./hooks/useGlobalState";

function App() {
  const {
    globalState: { themeObject },
  } = useGlobalState();

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={themeObject}>
      <CustomFonts />
      <Routes>
        <Route path="/" element={<LoginWrapper />} />
        <Route path="dashboard" element={<HomeWrapper />}>
          <Route path=":metricsView" element={<Dashboard />} />
          <Route path="directory" element={<DirectoryWrapper />} />
          <Route
            path="chart/:chartHeading"
            element={<DisplayResponsiveChartWrapper />}
          />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />

        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/register" element={<RegisterWrapper />} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
