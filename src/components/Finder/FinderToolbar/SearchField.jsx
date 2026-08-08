import React from "react";
import { FaSearch, FaTimesCircle } from "react-icons/fa";

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
  // Compute width classes
  let widthClass = "";
  if (ultraCompact) {
    widthClass = "w-0 border-0 px-0 opacity-0 pointer-events-none";
  } else if (compact) {
    widthClass = "w-28";
  } else {
    widthClass = "w-52";
  }

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
        type="search"
        className={[
          "rounded-2xl border min-w-0 py-2.5 pl-10 pr-10 outline-none transition-all duration-300 ease-out focus:ring-2",
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
        onChange={e => onChange?.(e.target.value)}
        spellCheck={false}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange?.("")}
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