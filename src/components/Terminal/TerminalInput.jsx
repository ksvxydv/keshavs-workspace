import { useDesktopSettings } from "../../context/useDesktopSettings";

export default function TerminalInput({
  value,
  onChange,
  onSubmit,
  onHistoryUp,
  onHistoryDown,
  onAutocomplete,
}) {
  const { theme } = useDesktopSettings();

  return (
    <div
      className="mt-3 flex items-center gap-2 border-t pt-3"
      style={{ borderColor: "var(--border)" }}
    >
      <span className="select-none" style={{ color: "inherit" }}>
        K-OS %
      </span>

      <input
        autoFocus
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit();
          } else if (e.key === "Tab") {
            e.preventDefault();
            onAutocomplete?.();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            onHistoryUp?.();
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            onHistoryDown?.();
          }
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="flex-1 bg-transparent font-mono outline-none"
        style={{ color: "inherit", caretColor: "inherit" }}
      />
    </div>
  );
}
