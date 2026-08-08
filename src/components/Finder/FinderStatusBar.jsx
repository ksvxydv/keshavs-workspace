

export default function FinderStatusBar({
  itemCount = 0,
  currentPath = [],
  viewMode = "grid",
}) {
  const location = (() => {
    if (typeof currentPath === "string") {
      if (currentPath === "/") return "Home";

      return currentPath
        .split("/")
        .filter(Boolean)
        .join(" / ");
    }

    if (Array.isArray(currentPath)) {
      if (currentPath.length === 0) return "Home";

      return currentPath
        .map((part) =>
          typeof part === "string"
            ? part
            : part?.displayName ?? part?.name ?? ""
        )
        .filter(Boolean)
        .join(" / ");
    }

    return "Home";
  })();

  return (
    <footer
      className="relative flex h-9 items-center justify-between px-5 text-[11px] font-medium select-none"
      style={{
        background: "color-mix(in srgb, var(--window-secondary) 82%, transparent)",
        borderTop: "1px solid color-mix(in srgb, var(--border) 60%, transparent)",
        color: "var(--text)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <span className="tracking-[0.01em] opacity-80">
        {itemCount} {itemCount === 1 ? "Item" : "Items"}
      </span>
      <span className="absolute left-1/2 -translate-x-1/2 opacity-65 pointer-events-none">
        {location}
      </span>
      <span className="capitalize opacity-80 tracking-[0.01em]">
        {viewMode} View
      </span>
    </footer>
  );
}