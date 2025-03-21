import { MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import CustomFonts from "./components/customFonts";
import DashboardWrapper from "./components/dashboard";
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
        <Route path="/" element={<HomeWrapper />}>
          <Route path=":metricsView" element={<DashboardWrapper />} />
          <Route path=":metricsView" element={<DashboardWrapper />} />
          <Route path=":metricsView" element={<DashboardWrapper />} />
          <Route path=":metricsView" element={<DashboardWrapper />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/register" element={<RegisterWrapper />} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
