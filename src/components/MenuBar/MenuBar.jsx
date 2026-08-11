import { useContext, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { WindowManagerContext } from "../../core/window/WindowManagerContext";
import Clock from "./Clock";
import MenuLeft from "./MenuLeft";
import MenuRight from "./MenuRight";
import { AnimatePresence } from "framer-motion";
import ControlCenter from "../ControlCenter/ControlCenter";
import useSystem from "../../core/system/useSystem";

export default function MenuBar() {
  const { activeWindowId, isActiveWindowMaximized, openWindow } = useContext(WindowManagerContext);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const controlCenterRef = useRef(null);
  const [showBatteryPopover, setShowBatteryPopover] = useState(false);
  const { setWifi, battery } = useSystem();

  useEffect(() => {
    if (!isActiveWindowMaximized) {
      setShowMenuBar(true);
    } else {
      setShowMenuBar(false);
    }
  }, [isActiveWindowMaximized]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        controlCenterRef.current &&
        !controlCenterRef.current.contains(e.target)
      ) {
        setShowControlCenter(false);
        setShowBatteryPopover(false);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {isActiveWindowMaximized && !showMenuBar && (
        <div
          className="fixed inset-x-0 top-0 h-5 z-[6001]"
          onMouseEnter={() => setShowMenuBar(true)}
        />
      )}
      <motion.header
        initial={{
          y: -20,
          opacity: 0,
        }}
        animate={
          !isActiveWindowMaximized
            ? { y: 0, opacity: 1 }
            : showMenuBar
            ? { y: 0, opacity: 1 }
            : { y: -40, opacity: 0 }
        }
        transition={{
          delay: 0.1,
          duration: 0.5,
          type: "spring",
          stiffness: 380,
          damping: 32,
        }}
        onMouseEnter={() => isActiveWindowMaximized && setShowMenuBar(true)}
        onMouseLeave={() => isActiveWindowMaximized && setShowMenuBar(false)}
        className="fixed left-0 top-0 z-[5000] flex h-8 w-full items-center justify-between border-b px-3 backdrop-blur-3xl transition-colors duration-300 will-change-transform"
        style={{
          background: "var(--glass)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          borderColor: "var(--glass-border)",
          color: "var(--text)",
          boxShadow: "inset 0 -1px 0 var(--border-soft)",
        }}
      >
        <MenuLeft activeApp={activeWindowId ?? "finder"} />

        <MenuRight
          onMusic={() => {
            openWindow("music");
          }}
          onWifi={() => setWifi((v) => !v)}
          onBattery={() => setShowBatteryPopover((v) => !v)}
          onControlCenter={() => setShowControlCenter((v) => !v)}
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Clock />

            <div className="relative flex-shrink-0" ref={controlCenterRef}>
              {showBatteryPopover && (
                <div
                  className="absolute right-12 top-10 z-[7000] w-56 rounded-2xl border p-4"
                  style={{
                    background: "var(--glass)",
                    borderColor: "var(--glass-border)",
                    boxShadow: "var(--window-shadow)",
                  }}
                >
                  {(() => {
                    const totalHours = (battery / 100) * 10;
                    const hours = Math.floor(totalHours);
                    const minutes = Math.round((totalHours - hours) * 60);

                    return (
                      <>
                        <div className="text-base font-semibold" style={{ color: "var(--text)" }}>
                          Battery {battery}%
                        </div>

                        <div
                          className="mt-1 text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Estimated runtime remaining
                        </div>

                        <div
                          className="mt-2 text-sm font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          {hours}h {minutes}m remaining
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
              <AnimatePresence>
                {showControlCenter && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-10 z-[7000] origin-top-right"
                  >
                    <ControlCenter />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </MenuRight>
      </motion.header>
    </>
  );
}
