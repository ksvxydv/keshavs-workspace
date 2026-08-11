import { useEffect, useMemo, useState } from "react";
import { accentColors } from "../data/accentColors";
import { wallpapers } from "../data/wallpapers";
import { DesktopSettingsContext } from "./DesktopSettingsContext";

export function DesktopSettingsProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("k-os-theme") ?? "dark",
  );

  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem("k-os-accent") ?? "blue",
  );

  const [wallpaper, setWallpaper] = useState(() => {
    const savedId = localStorage.getItem("k-os-wallpaper");

    return (
      wallpapers.find((item) => item.id === savedId) ??
      wallpapers.find((item) => item.id === "tahoe") ??
      wallpapers[0]
    );
  });

  const [dockSize, setDockSize] = useState(() => {
    const saved = localStorage.getItem("k-os-dock-size");
    return saved ? parseInt(saved, 10) : 56;
  });

  const [dockMagnification, setDockMagnification] = useState(() => {
    const saved = localStorage.getItem("k-os-dock-mag");
    return saved ? saved === "true" : true;
  });

  const [twentyFourHourTime, setTwentyFourHourTime] = useState(() => {
    const saved = localStorage.getItem("k-os-24h");
    return saved ? saved === "true" : true;
  });

  const [showDesktopIcons, setShowDesktopIcons] = useState(() => {
    const saved = localStorage.getItem("k-os-desktop-icons");
    return saved ? saved === "true" : true;
  });


  useEffect(() => {
    const selectedAccent = accentColors.find(
      (color) => color.id === accentColor,
    );

    document.documentElement.style.setProperty(
      "--accent",
      selectedAccent?.value ?? "#0A84FF",
    );
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem("k-os-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("k-os-accent", accentColor);
  }, [accentColor]);

  useEffect(() => {
    if (wallpaper?.id) {
      localStorage.setItem("k-os-wallpaper", wallpaper.id);
    }
  }, [wallpaper]);

  useEffect(() => {
    localStorage.setItem("k-os-dock-size", dockSize);
  }, [dockSize]);

  useEffect(() => {
    localStorage.setItem("k-os-dock-mag", dockMagnification);
  }, [dockMagnification]);

  useEffect(() => {
    localStorage.setItem("k-os-24h", twentyFourHourTime);
  }, [twentyFourHourTime]);

  useEffect(() => {
    localStorage.setItem("k-os-desktop-icons", showDesktopIcons);
  }, [showDesktopIcons]);


  const value = useMemo(
    () => ({
      theme,
      setTheme,
      wallpaper,
      setWallpaper,
      accentColor,
      setAccentColor,
      dockSize,
      setDockSize,
      dockMagnification,
      setDockMagnification,
      twentyFourHourTime,
      setTwentyFourHourTime,
      showDesktopIcons,
      setShowDesktopIcons,
    }),
    [
      theme,
      wallpaper,
      accentColor,
      dockSize,
      dockMagnification,
      twentyFourHourTime,
      showDesktopIcons,
    ],
  );

  return (
    <DesktopSettingsContext.Provider value={value}>
      {children}
    </DesktopSettingsContext.Provider>
  );
}
