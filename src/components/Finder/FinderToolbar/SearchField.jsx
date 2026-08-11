import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimesCircle } from "react-icons/fa";
import ToolbarButton from "./ToolbarButton";

/**
 * SearchField - a reusable search input with icon, supporting compact and ultraCompact modes.
 * Presentation-only, no Finder-specific state.
 */
const SearchField = ({
  id,
  value = "",
  onChange,
  compact = false,
  ultraCompact = false,
  placeholder = "Search",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

  // Reset expansion state when returning to normal size
  useEffect(() => {
    if (!compact && !ultraCompact) {
      setIsExpanded(false);
    }
  }, [compact, ultraCompact]);

  // Focus input when expanding
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // If in compact mode, not expanded, and no active search value, show just the button
  if ((compact || ultraCompact) && !isExpanded && !value) {
    return (
      <ToolbarButton size="sm" onClick={() => setIsExpanded(true)} aria-label="Search">
        <FaSearch />
      </ToolbarButton>
    );
  }

  // Compute width classes for the expanded/normal input
  const widthClass = (compact || ultraCompact) ? "w-48" : "w-52";

  return (
    <div className="relative flex shrink-0 items-center overflow-hidden">
      <FaSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        size={16}
        style={{ color: "var(--text-muted)" }}
        aria-hidden="true"
      />
      <input
        id={id}
        ref={inputRef}
        type="search"
        className={[
          "rounded-[14px] border min-w-0 py-2 pl-9 pr-8 outline-none transition-all duration-300 ease-out focus:ring-2",
          widthClass,
        ].join(" ")}
        style={{
          background: "color-mix(in srgb, var(--window) 70%, transparent)",
          color: "var(--text)",
          borderColor: "color-mix(in srgb, var(--border) 90%, transparent)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.08)",
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={() => {
          if (!value) setIsExpanded(false);
        }}
        spellCheck={false}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange?.("");
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
          aria-label="Clear search"
        >
          <FaTimesCircle
            size={14}
            style={{ color: "var(--text-muted)", opacity: 0.75 }}
          />
        </button>
      )}
    </div>
  );
};

export default SearchField;