import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./theme/ThemeProvider";
import { DesktopSettingsProvider } from "./context/DesktopSettingsProvider";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DesktopSettingsProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </DesktopSettingsProvider>
  </React.StrictMode>,
);
