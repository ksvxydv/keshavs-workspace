import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 650;
const MIN_WIDTH = 700;
const MIN_HEIGHT = 450;

export default function useWindowManager() {
  const [openWindows, setOpenWindows] = useState([]);
  const [, setTopZIndex] = useState(1);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [isMissionControlActive, setIsMissionControlActive] = useState(false);

  const activeWindow = openWindows.find((w) => w.id === activeWindowId);
  const isActiveWindowMaximized = activeWindow?.maximized ?? false;

  const dragState = useRef(null);
  const resizeState = useRef(null);
  const dockItemBoundsRef = useRef(new Map());

  const setDockItemBounds = useCallback((appId, bounds) => {
    if (!bounds) {
      dockItemBoundsRef.current.delete(appId);
      return;
    }

    dockItemBoundsRef.current.set(appId, {
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
    });
  }, []);

  function openWindow(appId) {
    setTopZIndex((currentTop) => {
      const nextTop = currentTop + 1;

      setOpenWindows((current) => {
        const existing = current.find((w) => w.id === appId);

        if (existing) {
          return current.map((w) =>
            w.id === appId
              ? {
                  ...w,
                  zIndex: nextTop,
                  minimized: false,
                  minimizing: false,
                  minimizeAnimation: null,
                  closing: false,
                }
              : w,
          );
        }

        return [
          ...current,
          {
            id: appId,
            x: 180,
            y: 90,
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
            zIndex: nextTop,
            minimized: false,
            minimizing: false,
            minimizeAnimation: null,
            maximized: false,
            previousBounds: null,
            isAnimating: false,
            closing: false,
          },
        ];
      });

      return nextTop;
    });

    setActiveWindowId(appId);
  }

  function closeWindow(appId) {
    setOpenWindows((current) =>
      current.map((w) =>
        w.id === appId
          ? {
              ...w,
              closing: true,
            }
          : w,
      ),
    );
  }

  function completeClose(appId) {
    setOpenWindows((current) => current.filter((w) => w.id !== appId));

    setActiveWindowId((current) => (current === appId ? null : current));
  }

  function minimizeWindow(appId, sourceBounds) {
    const targetBounds = dockItemBoundsRef.current.get(appId);
    const source = sourceBounds && {
      left: sourceBounds.left,
      top: sourceBounds.top,
      width: sourceBounds.width,
      height: sourceBounds.height,
    };

    setOpenWindows((current) =>
      current.map((w) =>
        w.id !== appId
          ? w
          : targetBounds && source
            ? {
                ...w,
                minimizing: true,
                minimizeAnimation: {
                  source,
                  target: targetBounds,
                },
              }
            : {
                ...w,
                minimized: true,
                minimizing: false,
                minimizeAnimation: null,
              },
      ),
    );

    if (!targetBounds || !source) {
      setActiveWindowId((current) => (current === appId ? null : current));
    }
  }

  function completeMinimize(appId) {
    setOpenWindows((current) =>
      current.map((w) =>
        w.id === appId
          ? {
              ...w,
              minimized: true,
              minimizing: false,
            }
          : w,
      ),
    );

    setActiveWindowId((current) => (current === appId ? null : current));
  }

  function maximizeWindow(appId) {
    setOpenWindows((current) =>
      current.map((w) => {
        if (w.id !== appId) return w;

        if (w.maximized) {
          return {
            ...w,
            ...w.previousBounds,
            maximized: false,
            previousBounds: null,
          };
        }

        return {
          ...w,
          previousBounds: {
            x: w.x,
            y: w.y,
            width: w.width,
            height: w.height,
          },
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          maximized: true,
        };
      }),
    );
  }

  function restoreWindow(appId) {
    setTopZIndex((currentTop) => {
      const nextTop = currentTop + 1;

      setOpenWindows((current) =>
        current.map((w) =>
          w.id === appId
            ? {
                ...w,
                minimized: false,
                minimizing: false,
                minimizeAnimation: null,
                closing: false,
                isAnimating: false,
                zIndex: nextTop,
              }
            : w,
        ),
      );

      return nextTop;
    });

    setActiveWindowId(appId);
  }

  function focusWindow(appId) {
    setActiveWindowId(appId);
    setTopZIndex((currentTop) => {
      const nextTop = currentTop + 1;

      setOpenWindows((current) =>
        current.map((w) => (w.id === appId ? { ...w, zIndex: nextTop } : w)),
      );

      return nextTop;
    });
  }

  function startDragging(appId, event) {
    const windowObj = openWindows.find((w) => w.id === appId);
    if (!windowObj) return;

    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    event.preventDefault();

    let currentX = windowObj.x;
    let currentY = windowObj.y;
    let currentW = windowObj.width;
    let currentH = windowObj.height;

    // Unsnap on drag if it was snapped (has previousBounds but not maximized)
    if (windowObj.previousBounds && !windowObj.maximized) {
      currentW = windowObj.previousBounds.width;
      currentH = windowObj.previousBounds.height;
      const ratio = (event.clientX - windowObj.x) / windowObj.width;
      currentX = event.clientX - (currentW * ratio);
      currentY = event.clientY - 15;
      
      setOpenWindows((current) => current.map((w) => w.id === appId ? {
        ...w,
        width: currentW,
        height: currentH,
        x: currentX,
        y: currentY,
        previousBounds: null
      } : w));
    }

    dragState.current = {
      id: appId,
      offsetX: event.clientX - currentX,
      offsetY: event.clientY - currentY,
      startX: currentX,
      startY: currentY,
      startWidth: currentW,
      startHeight: currentH,
    };
  }

  function startResizing(appId, direction, event) {
    event.stopPropagation();

    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    event.preventDefault();

    const currentWindow = openWindows.find((w) => w.id === appId);
    if (!currentWindow || currentWindow.maximized) return;

    resizeState.current = {
      id: appId,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: currentWindow.width,
      startHeight: currentWindow.height,
      startLeft: currentWindow.x,
      startTop: currentWindow.y,
    };
  }

  function moveWindow(appId, x, y) {
    setOpenWindows((current) =>
      current.map((w) =>
        w.id === appId
          ? {
              ...w,
              x,
              y,
            }
          : w,
      ),
    );
  }

  useEffect(() => {
    function handleMouseMove(event) {
      if (resizeState.current) {
        const r = resizeState.current;

        const dx = event.clientX - r.startX;
        const dy = event.clientY - r.startY;

        setOpenWindows((current) =>
          current.map((w) => {
            if (w.id !== r.id) return w;

            let x = r.startLeft;
            let y = r.startTop;
            let width = r.startWidth;
            let height = r.startHeight;

            if (r.direction.includes("right")) {
              width = Math.max(MIN_WIDTH, r.startWidth + dx);
            }

            if (r.direction.includes("left")) {
              width = Math.max(MIN_WIDTH, r.startWidth - dx);
              x = r.startLeft + (r.startWidth - width);
            }

            if (r.direction.includes("bottom")) {
              height = Math.max(MIN_HEIGHT, r.startHeight + dy);
            }

            if (r.direction.includes("top")) {
              height = Math.max(MIN_HEIGHT, r.startHeight - dy);
              y = r.startTop + (r.startHeight - height);
            }

            return {
              ...w,
              x,
              y,
              width,
              height,
            };
          }),
        );

        return;
      }
      if (!dragState.current) return;

      moveWindow(
        dragState.current.id,
        event.clientX - dragState.current.offsetX,
        event.clientY - dragState.current.offsetY,
      );
    }

    function handleMouseUp(event) {
      if (dragState.current) {
        const { id, startX, startY, startWidth, startHeight } = dragState.current;
        const clientX = event.clientX;
        const clientY = event.clientY;
        
        setOpenWindows((current) => {
          return current.map(w => {
            if (w.id !== id || w.maximized) return w;
            
            const threshold = 15;
            const menuBarHeight = 28; // K-OS menu bar height
            
            let snapWidth = null;
            let snapHeight = null;
            let snapX = null;
            let snapY = null;
            
            if (clientX <= threshold) {
              // Snap Left
              snapWidth = window.innerWidth / 2;
              snapHeight = window.innerHeight - menuBarHeight;
              snapX = 0;
              snapY = menuBarHeight;
            } else if (clientX >= window.innerWidth - threshold) {
              // Snap Right
              snapWidth = window.innerWidth / 2;
              snapHeight = window.innerHeight - menuBarHeight;
              snapX = window.innerWidth / 2;
              snapY = menuBarHeight;
            } else if (clientY <= menuBarHeight) {
              // Snap Maximize
              snapWidth = window.innerWidth;
              snapHeight = window.innerHeight - menuBarHeight;
              snapX = 0;
              snapY = menuBarHeight;
            }
            
            if (snapWidth !== null) {
               return {
                 ...w,
                 previousBounds: w.previousBounds || { x: startX, y: startY, width: startWidth, height: startHeight },
                 x: snapX,
                 y: snapY,
                 width: snapWidth,
                 height: snapHeight
               };
            }
            return w;
          });
        });
      }

      dragState.current = null;
      resizeState.current = null;
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);


  useEffect(() => {
    function handleResize() {
      setOpenWindows((current) =>
        current.map((w) =>
          w.maximized
            ? {
                ...w,
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight,
              }
            : w,
        ),
      );
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "F3" || (e.ctrlKey && e.key === "ArrowUp")) {
        e.preventDefault();
        setIsMissionControlActive((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    openWindows,
    activeWindowId,
    isActiveWindowMaximized,
    openWindow,
    closeWindow,
    completeClose,
    minimizeWindow,
    completeMinimize,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    startDragging,
    startResizing,
    moveWindow,
    setDockItemBounds,
    isMissionControlActive,
    setIsMissionControlActive,
  };
}
