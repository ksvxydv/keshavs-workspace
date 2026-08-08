import { useEffect, useRef } from "react";
import WindowManager from "../../core/window/WindowManager";
import { desktopApps } from "../../data/desktopApps";
import { appRegistry } from "../../data/appRegistry";
import DesktopIconGrid from "./DesktopIconGrid";
import MenuBar from "../MenuBar/MenuBar";
import Dock from "../Dock/Dock";
import BrightnessOverlay from "../../core/system/BrightnessOverlay";

import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { motion } from "framer-motion";
import { registerTerminalActions } from "../../terminal/terminalActions";

function getWindowAnimation(window) {
  if (window.closing) {
    return { opacity: 0, scale: 0.96 };
  }

  if (window.minimizing && window.minimizeAnimation) {
    const { source, target } = window.minimizeAnimation;
    const scale = Math.min(
      target.width / source.width,
      target.height / source.height,
    );

    return {
      opacity: 0,
      scale,
      x: target.left - source.left + (target.width - source.width * scale) / 2,
      y: target.top - source.top + (target.height - source.height * scale) / 2,
    };
  }

  return { opacity: 1, scale: 1, x: 0, y: 0 };
}

export default function Desktop() {
  const {
    wallpaper,
    theme,
    accentColor,
    setWallpaper,
    setTheme,
    setAccentColor,
  } = useDesktopSettings();

  const openWindowRef = useRef(null);
  const windowElementsRef = useRef(new Map());

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
        completeClose,
        minimizeWindow,
        completeMinimize,
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
          >
            <BrightnessOverlay />

            {/* Menu Bar */}
            <MenuBar />
            <DesktopIconGrid apps={desktopApps} onOpen={openWindow} />

            {/* Windows */}
            {openWindows.map((window) => {
              const App = appRegistry[window.id]?.component;

              if (!App) return null;
              if (window.minimized) {
                console.log("Window is minimized:", window.id, window);
                return null;
              }

              return (
                <motion.div
                  key={window.id}
                  ref={(element) => {
                    if (element) {
                      windowElementsRef.current.set(window.id, element);
                      return;
                    }

                    windowElementsRef.current.delete(window.id);
                  }}
                  initial={false}
                  animate={getWindowAnimation(window)}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  onAnimationComplete={() => {
                    if (window.closing) {
                      completeClose(window.id);
                    }

                    if (window.minimizing) {
                      completeMinimize(window.id);
                    }
                  }}
                  style={{
                    position: "absolute",
                    left: window.maximized ? 0 : window.x,
                    top: window.maximized ? 0 : window.y,
                    width: window.maximized ? "100vw" : window.width,
                    height: window.maximized ? "100vh" : window.height,
                    zIndex: window.zIndex,
                    overflow: "hidden",
                    pointerEvents:
                      window.closing || window.minimizing ? "none" : "auto",
                    transformOrigin: window.minimizing ? "top left" : "center",
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
                      minimizeWindow(
                        window.id,
                        windowElementsRef.current
                          .get(window.id)
                          ?.getBoundingClientRect(),
                      );
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
                </motion.div>
              );
            })}
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
