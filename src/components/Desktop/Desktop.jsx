import { useEffect, useRef } from "react";
import WindowManager from "../../core/window/WindowManager";
import { desktopApps } from "../../data/desktopApps";
import { appRegistry } from "../../data/appRegistry";
import DesktopIconGrid from "./DesktopIconGrid";
import MenuBar from "../MenuBar/MenuBar";
import Dock from "../Dock/Dock";
import BrightnessOverlay from "../../core/system/BrightnessOverlay";

import { useDesktopSettings } from "../../context/useDesktopSettings";
import { motion } from "framer-motion";
import { registerTerminalActions } from "../../terminal/terminalActions";

function getWindowAnimation(window, isMC, mcProps) {
  if (window.closing) {
    return { opacity: 0, scale: 0.96 };
  }

  if (isMC) {
    return {
      opacity: 1,
      scale: mcProps.scale,
      x: mcProps.x,
      y: mcProps.y,
    };
  }

  if ((window.minimizing || window.minimized) && window.minimizeAnimation) {
    return {
      opacity: 0,
      scaleX: 0.1,
      scaleY: 0.05,
      x: 0,
      y: 0,
    };
  }

  if (window.minimized) {
    return { opacity: 0, scale: 0.8 };
  }

  return { opacity: 1, scaleX: 1, scaleY: 1, x: 0, y: 0 };
}

export default function Desktop() {
  const {
    wallpaper,
    theme,
    accentColor,
    setWallpaper,
    setTheme,
    setAccentColor,
    showDesktopIcons,
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
        isMissionControlActive,
        setIsMissionControlActive,
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
            {showDesktopIcons && (
              <DesktopIconGrid apps={desktopApps} onOpen={openWindow} />
            )}

            {/* Mission Control Overlay */}
            <motion.div
              initial={false}
              animate={{ opacity: isMissionControlActive ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-40 pointer-events-none"
              style={{
                background: "rgba(0,0,0,0.4)",
                backdropFilter: isMissionControlActive ? "blur(12px)" : "none",
                WebkitBackdropFilter: isMissionControlActive ? "blur(12px)" : "none",
              }}
            />

            {/* Windows */}
            {openWindows.map((window, idx) => {
              const App = appRegistry[window.id]?.component;

              if (!App) return null;


              let mcProps = {};
              if (isMissionControlActive) {
                const visibleWindows = openWindows.filter(w => !w.minimized);
                const cols = Math.max(1, Math.ceil(Math.sqrt(visibleWindows.length)));
                const activeIdx = visibleWindows.findIndex(w => w.id === window.id);
                
                const row = Math.floor(activeIdx / cols);
                const col = activeIdx % cols;
                
                const padding = 80;
                const availableW = window.innerWidth - padding * 2;
                const availableH = window.innerHeight - padding * 2;
                
                const cellW = availableW / cols;
                const cellH = availableH / Math.max(1, Math.ceil(visibleWindows.length / cols));
                
                const scale = Math.min((cellW - 40) / window.width, (cellH - 40) / window.height, 0.65);
                
                const targetX = padding + col * cellW + (cellW - window.width * scale) / 2;
                const targetY = padding + row * cellH + (cellH - window.height * scale) / 2;
                
                mcProps = {
                  x: targetX - (window.maximized ? 0 : window.x),
                  y: targetY - (window.maximized ? 0 : window.y),
                  scale: scale,
                };
              }

              let transformOrigin = "center";
              if ((window.minimizing || window.minimized) && window.minimizeAnimation) {
                const { source, target } = window.minimizeAnimation;
                const originX = (target.left + target.width / 2) - source.left;
                const originY = (target.top + target.height / 2) - source.top;
                transformOrigin = `${originX}px ${originY}px`;
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
                  animate={getWindowAnimation(window, isMissionControlActive, mcProps)}
                  transition={{ 
                    duration: (window.minimizing || window.minimized) ? 0.45 : 0.28, 
                    ease: (window.minimizing || window.minimized) ? "anticipate" : [0.22, 1, 0.36, 1] 
                  }}
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
                    zIndex: isMissionControlActive ? 50 + idx : window.zIndex,
                    overflow: "hidden",
                    pointerEvents:
                      window.closing || window.minimizing || window.minimized ? "none" : "auto",
                    transformOrigin,
                    cursor: isMissionControlActive ? "pointer" : "auto",
                    boxShadow: isMissionControlActive ? "0 20px 50px rgba(0,0,0,0.5)" : "none",
                  }}
                  onMouseDown={() => {
                    if (isMissionControlActive) {
                      setIsMissionControlActive(false);
                      focusWindow(window.id);
                      return;
                    }
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
