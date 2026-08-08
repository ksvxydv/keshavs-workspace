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
          background: "rgba(35,35,40,.28)",
          border: "1px solid rgba(255,255,255,.12)",
          color: "var(--text)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow:
            "0 10px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.10), inset 0 -1px 0 rgba(255,255,255,.04)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          zIndex: 1000,
          minWidth: "220px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10" onClick={() => { onOpen(); onClose(); }}>
          <span className="flex items-center gap-3"><FaFolderOpen /> Open</span>
          <span />
        </button>
        <div
          className="mx-2 h-px"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <button type="button" disabled className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm opacity-40 cursor-default">
          <span className="flex items-center gap-3"><FaPen /> Rename</span>
          <span className="text-xs opacity-50"></span>
        </button>
        <button type="button" disabled className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm opacity-40 cursor-default">
          <span className="flex items-center gap-3"><FaCopy /> Duplicate</span>
          <span className="text-xs opacity-50"></span>
        </button>
        <button type="button" disabled className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm opacity-40 cursor-default">
          <span className="flex items-center gap-3"><FaTrash /> Move to Trash</span>
          <span className="text-xs opacity-50"></span>
        </button>
        <button className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10" onClick={() => { onGetInfo(); onClose(); }}>
          <span className="flex items-center gap-3"><FaInfoCircle /> Get Info</span>
          <span />
        </button>
        <div
          className="mx-2 h-px"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <button className="flex w-full items-center justify-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10" onClick={onClose}>
          Cancel
        </button>
      </motion.div>
    </AnimatePresence>
  );
}