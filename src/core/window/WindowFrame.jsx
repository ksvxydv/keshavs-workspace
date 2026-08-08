import { motion } from "framer-motion";

export default function WindowFrame({
  title,
  maximized = false,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDragStart,
  onResizeStart,
}) {
  return (
    <motion.div
      layout
      layoutRoot
      initial={{
        opacity: 0,
        scale: 0.965,
        y: 10,
        filter: "blur(8px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        scale: 0.965,
        y: 8,
        filter: "blur(8px)",
      }}
      transition={{
        type: "spring",
        stiffness: 340,
        damping: 30,
        mass: 0.85,
      }}
      onMouseDown={onFocus}
      style={{
        background: "var(--window)",
        borderColor: "var(--border)",
        boxShadow: "var(--window-shadow)",
        transition:
          "background-color 250ms ease, border-color 250ms ease, color 250ms ease",
        width: "100%",
        height: "100%",
      }}
      className={`relative overflow-hidden border flex h-full flex-col ${
        maximized ? "rounded-none" : "rounded-2xl"
      }`}
    >
      {/* Resize Handles */}
      <div
        className="absolute inset-x-2 top-0 z-50 h-1 cursor-ns-resize pointer-events-auto"
        onMouseDown={(e) => onResizeStart?.("top", e)}
      />
      <div
        className="absolute inset-x-2 bottom-0 z-50 h-1 cursor-ns-resize pointer-events-auto"
        onMouseDown={(e) => onResizeStart?.("bottom", e)}
      />
      <div
        className="absolute inset-y-2 left-0 z-50 w-1 cursor-ew-resize pointer-events-auto"
        onMouseDown={(e) => onResizeStart?.("left", e)}
      />
      <div
        className="absolute inset-y-2 right-0 z-50 w-1 cursor-ew-resize pointer-events-auto"
        onMouseDown={(e) => onResizeStart?.("right", e)}
      />
      <div
        className="absolute left-0 top-0 z-50 h-3 w-3 cursor-nwse-resize pointer-events-auto"
        onMouseDown={(e) => onResizeStart?.("top-left", e)}
      />
      <div
        className="absolute right-0 top-0 z-50 h-3 w-3 cursor-nesw-resize pointer-events-auto"
        onMouseDown={(e) => onResizeStart?.("top-right", e)}
      />
      <div
        className="absolute left-0 bottom-0 z-50 h-3 w-3 cursor-nesw-resize pointer-events-auto"
        onMouseDown={(e) => onResizeStart?.("bottom-left", e)}
      />
      <div
        className="absolute bottom-0 right-0 z-50 h-3 w-3 cursor-nwse-resize pointer-events-auto"
        onMouseDown={(e) => onResizeStart?.("bottom-right", e)}
      />
      <div
        onMouseDown={maximized ? undefined : onDragStart}
        onDoubleClick={onMaximize}
        className={`relative flex h-9 items-center border-b px-4 select-none ${maximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
        style={{
          background: "var(--toolbar)",
          borderColor: "var(--border)",
        }}
      >
        <div className="group ml-3 flex items-center gap-[7px]">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="relative flex h-3 w-3 items-center justify-center rounded-full bg-red-500 transition hover:brightness-110"
          >
            <span className="pointer-events-none text-[8px] font-bold leading-none text-black opacity-0 transition-opacity duration-150 group-hover:opacity-100 select-none">
              ×
            </span>
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onMinimize}
            className="relative flex h-3 w-3 items-center justify-center rounded-full bg-yellow-500 transition hover:brightness-110"
          >
            <span className="pointer-events-none text-[8px] font-bold leading-none text-black opacity-0 transition-opacity duration-150 group-hover:opacity-100 select-none">
              −
            </span>
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onMaximize}
            className="relative flex h-3 w-3 items-center justify-center rounded-full bg-green-500 transition hover:brightness-110"
          >
            <span className="pointer-events-none text-[8px] font-bold leading-none text-black opacity-0 transition-opacity duration-150 group-hover:opacity-100 select-none">
              ↗
            </span>
          </button>
        </div>
        <div className="w-20" />
        <h2
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[13px] font-medium"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h2>
      </div>

      <div
        className="flex-1 overflow-hidden"
        style={{
          background: "var(--window-secondary)",
          color: "var(--text)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
