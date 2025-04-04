import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./context/authProvider/AuthProvider.tsx";
import { GlobalProvider } from "./context/globalProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AuthProvider>
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={<App />}
          />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  </AuthProvider>,
  // </StrictMode>,
);
