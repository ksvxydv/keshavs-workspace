import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import DesktopIcon from "./DesktopIcon";
import DesktopContextMenu from "./DesktopContextMenu";
import useDesktopContextMenu from "./hooks/useDesktopContextMenu";
import useDesktopSelection from "./hooks/useDesktopSelection";

export default function DesktopIconGrid({ apps, onOpen }) {
  const {
    selectedIds,
    selectionRect,
    registerIcon,
    selectIcon,
    selectOnly,
    clearSelection,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useDesktopSelection();
  const desktopSurfaceRef = useRef(null);
  const {
    contextMenu,
    menuRef,
    openContextMenu,
    closeContextMenu,
  } = useDesktopContextMenu();

  const contextMenuActions = contextMenu?.target
    ? [
        {
          id: "open",
          label: "Open",
          onSelect: () => {
            onOpen(contextMenu.target.app);
            closeContextMenu();
          },
        },
      ]
    : [
        {
          id: "open-finder",
          label: "Open Finder",
          onSelect: () => {
            onOpen("finder");
            closeContextMenu();
          },
        },
        {
          id: "open-settings",
          label: "Open Settings…",
          onSelect: () => {
            onOpen("settings");
            closeContextMenu();
          },
        },
      ];

  function handleDesktopPointerDown(event) {
    closeContextMenu();
    handlePointerDown(event);
  }

  function handleDesktopContextMenu(event) {
    if (
      event.target.closest?.(
        "[data-desktop-icon], [data-desktop-context-menu]",
      )
    ) {
      return;
    }

    event.preventDefault();
    clearSelection();
    openContextMenu({
      clientX: event.clientX,
      clientY: event.clientY,
      surfaceRect: desktopSurfaceRef.current.getBoundingClientRect(),
      target: null,
    });
  }

  function handleIconContextMenu(event, app) {
    event.preventDefault();
    event.stopPropagation();
    selectOnly(app.id);
    openContextMenu({
      clientX: event.clientX,
      clientY: event.clientY,
      surfaceRect: desktopSurfaceRef.current.getBoundingClientRect(),
      target: app,
    });
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        clearSelection();
        return;
      }

      if (event.key !== "Enter" || selectedIds.size !== 1) return;

      const [selectedId] = selectedIds;
      const selectedApp = apps.find((app) => app.id === selectedId);

      if (!selectedApp) return;

      event.preventDefault();
      onOpen(selectedApp.app);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [apps, clearSelection, onOpen, selectedIds]);

  return (
    <div
      ref={desktopSurfaceRef}
      aria-label="Desktop icons"
      className="absolute inset-0"
      onPointerDown={handleDesktopPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={handleDesktopContextMenu}
    >
      {selectionRect && (selectionRect.width > 0 || selectionRect.height > 0) && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-sm border"
          style={{
            left: selectionRect.left,
            top: selectionRect.top,
            width: selectionRect.width,
            height: selectionRect.height,
            backgroundColor: "var(--selection)",
            borderColor: "var(--accent)",
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="absolute right-8 top-12 flex flex-col gap-6"
      >
        {apps.map((app) => (
          <div
            key={app.id}
            data-desktop-icon
            ref={(element) => registerIcon(app.id, element)}
            onContextMenu={(event) => handleIconContextMenu(event, app)}
          >
            <DesktopIcon
              name={app.name}
              selected={selectedIds.has(app.id)}
              onSelect={(event) => selectIcon(app.id, event)}
              onOpen={() => onOpen(app.app)}
            />
          </div>
        ))}
      </motion.div>

      <DesktopContextMenu
        contextMenu={contextMenu}
        actions={contextMenuActions}
        menuRef={menuRef}
      />
    </div>
  );
}
