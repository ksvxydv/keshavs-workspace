import { AnimatePresence, motion } from "framer-motion";

export default function DesktopContextMenu({
  contextMenu,
  actions,
  menuRef,
}) {
  return (
    <AnimatePresence>
      {contextMenu && (
        <motion.div
          ref={menuRef}
          data-desktop-context-menu
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="absolute z-[1000] min-w-52 overflow-hidden rounded-xl border py-1 shadow-2xl backdrop-blur-3xl"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            background: "var(--glass)",
            borderColor: "var(--glass-border)",
            boxShadow: "var(--window-shadow)",
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-white/10"
              onClick={action.onSelect}
            >
              {action.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
