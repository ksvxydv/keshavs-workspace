import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { WindowManagerContext } from "../../core/window/WindowManagerContext";
import { dockApps } from "../../data/dockApps";
import { useDesktopSettings } from "../../context/useDesktopSettings";

export default function Dock() {
  const {
    openWindow,
    restoreWindow,
    focusWindow,
    openWindows,
    setDockItemBounds,
  } = useContext(WindowManagerContext);
  const { dockSize, dockMagnification } = useDesktopSettings();
  const dockRef = useRef(null);
  const dockItemRefs = useRef(new Map());
  const [mouseX, setMouseX] = useState(null);
  const [bouncingApp, setBouncingApp] = useState(null);

  const registerDockItemRef = useCallback((appId, element) => {
    if (element) {
      dockItemRefs.current.set(appId, element);
      return;
    }

    dockItemRefs.current.delete(appId);
  }, []);

  const syncDockItemBounds = useCallback(() => {
    dockItemRefs.current.forEach((element, appId) => {
      setDockItemBounds(appId, element.getBoundingClientRect());
    });
  }, [setDockItemBounds]);

  useLayoutEffect(() => {
    syncDockItemBounds();
  }, [mouseX, syncDockItemBounds]);

  useLayoutEffect(() => {
    const itemRefs = dockItemRefs.current;

    syncDockItemBounds();

    const resizeObserver = new ResizeObserver(syncDockItemBounds);

    if (dockRef.current) {
      resizeObserver.observe(dockRef.current);
    }

    window.addEventListener("resize", syncDockItemBounds);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncDockItemBounds);
      itemRefs.forEach((_element, appId) => {
        setDockItemBounds(appId, null);
      });
    };
  }, [setDockItemBounds, syncDockItemBounds]);

  useEffect(() => {
    if (!bouncingApp) return;

    const timer = setTimeout(() => {
      setBouncingApp(null);
    }, 700);

    return () => clearTimeout(timer);
  }, [bouncingApp]);

  function handleOpen(app) {
    setBouncingApp(app.id);

    const existing = openWindows.find((w) => w.id === app.id);

    if (existing) {
      if (existing.minimized || existing.minimizing) {
        restoreWindow(app.id);
      }

      focusWindow?.(existing.id);
      return;
    }

    openWindow(app.id);
  }

  return (
    <>
      <style>{`
@keyframes dockBounce {
  0% { transform: translateY(0) scale(${1}); }
  18% { transform: translateY(-18px) scale(1.02); }
  38% { transform: translateY(0); }
  55% { transform: translateY(-10px); }
  72% { transform: translateY(0); }
  86% { transform: translateY(-4px); }
  100% { transform: translateY(0); }
}
`}</style>
      <div className="fixed bottom-3 left-1/2 z-[999] -translate-x-1/2">
        <div
          ref={dockRef}
          onMouseMove={(e) => setMouseX(e.clientX)}
          onMouseLeave={() => setMouseX(null)}
          className="flex items-end gap-1 rounded-[26px] border px-3 py-2 backdrop-blur-3xl transition-all duration-300 overflow-visible"
          style={{
            background: "var(--dock)",
            borderColor: "var(--glass-border)",
            backdropFilter: "blur(34px) saturate(180%)",
            WebkitBackdropFilter: "blur(34px) saturate(180%)",
            boxShadow: "var(--window-shadow), inset 0 1px 0 rgba(255,255,255,.12)",
          }}
        >
          {dockApps.map((app) => {
            const itemRect = dockItemRefs.current
              .get(app.id)
              ?.getBoundingClientRect();
            const distance =
              mouseX === null || !itemRect
                ? Infinity
                : Math.abs(mouseX - (itemRect.left + itemRect.width / 2));

            const maxDistance = 170;

            let scale = 1;

            if (dockMagnification && mouseX !== null) {
              const t = Math.max(0, 1 - distance / maxDistance);

              // Smooth macOS-style easing
              const eased = Math.sin((t * Math.PI) / 2);

              scale = 1 + eased * 0.28;
            }

            const running = openWindows.some((window) => window.id === app.id);

            return (
              <button
                key={app.id}
                ref={(element) => registerDockItemRef(app.id, element)}
                title={app.name}
                onClick={() => handleOpen(app)}
                className="group relative flex items-end justify-center rounded-[18px] transition-colors duration-150 hover:bg-white/8 active:scale-95"
                style={{
                  height: `${dockSize}px`,
                  width: `${dockSize}px`,
                  background: "transparent",
                  transform: `scale(${scale})`,
                  transformOrigin: "bottom center",
                  transition: "transform 140ms cubic-bezier(.22,1,.36,1)",
                  zIndex: Math.round(scale * 100),
                  animation:
                    bouncingApp === app.id
                      ? "dockBounce .7s cubic-bezier(.34,1.56,.64,1)"
                      : "none",
                }}
              >
                <img
                  src={app.icon}
                  alt={app.name}
                  draggable={false}
                  className="object-contain select-none pointer-events-none drop-shadow-md"
                  style={{
                    height: `${dockSize - 8}px`,
                    width: `${dockSize - 8}px`,
                  }}
                />

                <span
                  className="absolute -top-10 rounded-lg px-2 py-1 text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    background: "var(--window)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {app.name}
                </span>

                {running && (
                  <span
                    className="absolute -bottom-1 h-1.5 w-1.5 rounded-full shadow-sm"
                    style={{
                      background: "var(--accent)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
