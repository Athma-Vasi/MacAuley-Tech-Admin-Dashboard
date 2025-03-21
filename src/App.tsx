import { MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import CustomFonts from "./components/customFonts";
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
        <Route path="/" element={<HomeWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/register" element={<RegisterWrapper />} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
