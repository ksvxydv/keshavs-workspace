import { motion, AnimatePresence } from "framer-motion";
import {
  FaFolderOpen,
  FaInfoCircle,
  FaPen,
  FaCopy,
  FaTrash,
} from "react-icons/fa";

export default function FinderContextMenu({
  contextMenu,
  onOpen,
  onGetInfo,
  onClose,
}) {
  if (!contextMenu?.visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -4 }}
        transition={{ duration: 0.16 }}
        style={{
          position: "absolute",
          left: `${contextMenu.x}px`,
          top: `${contextMenu.y}px`,
          margin: 0,
          transform: "none",
          background: "var(--glass)",
          border: "1px solid var(--glass-border)",
          color: "var(--text)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow:
            "0 10px 40px rgba(0,0,0,.28), inset 0 1px 0 var(--glass-border), inset 0 -1px 0 rgba(0,0,0,.04)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          zIndex: 1000,
          minWidth: "220px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Active items */}
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors"
          style={{ color: "var(--text)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          onClick={() => { onOpen(); onClose(); }}
        >
          <span className="flex items-center gap-3"><FaFolderOpen /> Open</span>
          <span />
        </button>

        <div className="mx-2 h-px" style={{ background: "var(--border)" }} />

        {/* Disabled items */}
        {[
          { icon: <FaPen />, label: "Rename" },
          { icon: <FaCopy />, label: "Duplicate" },
          { icon: <FaTrash />, label: "Move to Trash" },
        ].map(({ icon, label }) => (
          <button
            key={label}
            type="button"
            disabled
            className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm cursor-default"
            style={{ color: "var(--text-muted)", opacity: 0.5 }}
          >
            <span className="flex items-center gap-3">{icon} {label}</span>
            <span />
          </button>
        ))}

        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors"
          style={{ color: "var(--text)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          onClick={() => { onGetInfo(); onClose(); }}
        >
          <span className="flex items-center gap-3"><FaInfoCircle /> Get Info</span>
          <span />
        </button>

        <div className="mx-2 h-px" style={{ background: "var(--border)" }} />

        <button
          type="button"
          className="flex w-full items-center justify-center px-4 py-2.5 text-sm transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          onClick={onClose}
        >
          Cancel
        </button>
      </motion.div>
    </AnimatePresence>
  );
}