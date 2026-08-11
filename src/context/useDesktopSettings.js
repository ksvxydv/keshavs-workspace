import { useContext } from "react";
import { DesktopSettingsContext } from "./DesktopSettingsContext";

export function useDesktopSettings() {
  const context = useContext(DesktopSettingsContext);

  if (!context) {
    throw new Error(
      "useDesktopSettings must be used within a DesktopSettingsProvider",
    );
  }

  return context;
}
