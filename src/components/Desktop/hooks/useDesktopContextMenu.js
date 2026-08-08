import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function useDesktopContextMenu() {
  const [contextMenu, setContextMenu] = useState(null);
  const menuRef = useRef(null);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const openContextMenu = useCallback(({ clientX, clientY, surfaceRect, target }) => {
    setContextMenu({
      x: clientX - surfaceRect.left,
      y: clientY - surfaceRect.top,
      surfaceWidth: surfaceRect.width,
      surfaceHeight: surfaceRect.height,
      target,
    });
  }, []);

  useLayoutEffect(() => {
    if (!contextMenu || !menuRef.current) return;

    const menuWidth = menuRef.current.offsetWidth;
    const menuHeight = menuRef.current.offsetHeight;
    const nextX = clamp(
      contextMenu.x,
      0,
      Math.max(0, contextMenu.surfaceWidth - menuWidth),
    );
    const nextY = clamp(
      contextMenu.y,
      0,
      Math.max(0, contextMenu.surfaceHeight - menuHeight),
    );

    if (nextX === contextMenu.x && nextY === contextMenu.y) return;

    setContextMenu((currentMenu) =>
      currentMenu
        ? {
            ...currentMenu,
            x: nextX,
            y: nextY,
          }
        : currentMenu,
    );
  }, [contextMenu]);

  useEffect(() => {
    if (!contextMenu) return undefined;

    function handlePointerDown(event) {
      if (menuRef.current?.contains(event.target)) return;
      closeContextMenu();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeContextMenu();
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeContextMenu);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeContextMenu);
    };
  }, [closeContextMenu, contextMenu]);

  return {
    contextMenu,
    menuRef,
    openContextMenu,
    closeContextMenu,
  };
}
