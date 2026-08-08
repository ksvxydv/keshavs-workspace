import { useEffect, useRef, useState } from "react";
import WindowManager from "../../core/window/WindowManager";
import { desktopApps } from "../../data/desktopApps";
import { appRegistry } from "../../data/appRegistry";
import DesktopIcon from "./DesktopIcon";
import MenuBar from "../MenuBar/MenuBar";
import Dock from "../Dock/Dock";
import BrightnessOverlay from "../../core/system/BrightnessOverlay";

import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { AnimatePresence, motion } from "framer-motion";
import { registerTerminalActions } from "../../terminal/terminalActions";

export default function Desktop() {
  const {
    wallpaper,
    theme,
    accentColor,
    setWallpaper,
    setTheme,
    setAccentColor,
  } = useDesktopSettings();

  const [selectedIcon, setSelectedIcon] = useState(null);
  const openWindowRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedIcon(null);
        return;
      }

      if (event.key === "Enter" && selectedIcon) {
        const app = desktopApps.find((item) => item.id === selectedIcon);
        if (app) {
          event.preventDefault();
          openWindowRef.current?.(app.app);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIcon]);

  useEffect(() => {
    if (!wallpaper?.colors) return;

    const root = document.documentElement;

    root.style.setProperty("--wallpaper-primary", wallpaper.colors.primary);
    root.style.setProperty("--wallpaper-secondary", wallpaper.colors.secondary);
    root.style.setProperty("--glass-tint", wallpaper.colors.primary);
    root.style.setProperty("--glass-border", "rgba(255,255,255,0.08)");
    root.style.setProperty("--glass-highlight", "rgba(255,255,255,0.12)");
    root.style.setProperty("--glass-shadow", "rgba(0,0,0,0.18)");
  }, [wallpaper]);

  function openDirectory(directoryId) {
    const app = desktopApps.find((item) => item.id === directoryId);
    if (app) {
      openWindowRef.current?.(app.app);
    }
  }

  return (
    <WindowManager>
      {({
        openWindows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        startDragging,
        startResizing,
      }) => {
        openWindowRef.current = openWindow;

        console.log("Open windows:", openWindows);

        registerTerminalActions({
          openWindow,
          openDirectory,
          setTheme,
          setAccentColor,
          setWallpaper,
          openWindowCount: () => openWindows.length,
          currentWallpaper: () => wallpaper.id,
          theme: () => theme,
          currentAccent: () => accentColor,
        });

        return (
          <motion.div
            initial={{
              scale: 1.04,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay: 0.15,
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-screen h-screen bg-cover bg-center relative"
            style={{ backgroundImage: `url(${wallpaper.image})` }}
            onClick={() => setSelectedIcon(null)}
          >
            <BrightnessOverlay />

            {/* Menu Bar */}
            <MenuBar />
            {/* Desktop Icons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="absolute right-8 top-12 flex flex-col gap-6"
            >
              {desktopApps.map((app) => (
                <DesktopIcon
                  key={app.id}
                  name={app.name}
                  selected={selectedIcon === app.id}
                  onSelect={(e) => {
                    e.stopPropagation();
                    setSelectedIcon(app.id);
                  }}
                  onOpen={() => openWindow(app.app)}
                />
              ))}
            </motion.div>

            {/* Windows */}
            <AnimatePresence mode="popLayout">
              {openWindows.map((window) => {
                const App = appRegistry[window.id]?.component;

                if (!App) return null;
                if (window.minimized) {
                  console.log("Window is minimized:", window.id, window);
                  return null;
                }

                return (
                  <div
                    key={window.id}
                    style={{
                      position: "absolute",
                      left: window.maximized ? 0 : window.x,
                      top: window.maximized ? 0 : window.y,
                      width: window.maximized ? "100vw" : window.width,
                      height: window.maximized ? "100vh" : window.height,
                      zIndex: window.zIndex,
                      overflow: "hidden",
                    }}
                    onMouseDown={() => {
                      if (window.id !== openWindows[openWindows.length - 1]?.id) {
                        focusWindow(window.id);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <App
                      window={window}
                      isMaximized={window.maximized}
                      onClose={() => {
                        console.log("Close clicked:", window.id);
                        closeWindow(window.id);
                      }}
                      onMinimize={() => {
                        console.log("Minimize clicked:", window.id);
                        minimizeWindow(window.id);
                      }}
                      onMaximize={() => maximizeWindow(window.id)}
                      onFocus={() => focusWindow(window.id)}
                      onDragStart={(event) => {
                        startDragging(window.id, event);
                      }}
                      onResizeStart={(direction, event) => {
                        focusWindow(window.id);
                        startResizing(window.id, direction, event);
                      }}
                    />
                  </div>
                );
              })}
            </AnimatePresence>
            {/* Dock */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
            >
              <Dock />
            </motion.div>
          </motion.div>
        );
      }}
    </WindowManager>
  );
}
