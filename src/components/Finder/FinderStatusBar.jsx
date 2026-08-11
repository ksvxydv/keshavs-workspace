export default function FinderStatusBar({
  itemCount = 0,
  currentPath = [],
  viewMode = "grid",
}) {
  const location = (() => {
    if (typeof currentPath === "string") {
      if (currentPath === "/") return "Home";
      return currentPath.split("/").filter(Boolean).join(" / ");
    }
    if (Array.isArray(currentPath)) {
      if (currentPath.length === 0) return "Home";
      return currentPath
        .map((part) =>
          typeof part === "string" ? part : part?.displayName ?? part?.name ?? ""
        )
        .filter(Boolean)
        .join(" / ");
    }
    return "Home";
  })();

  return (
    <footer
      className="relative flex h-9 shrink-0 items-center justify-between select-none"
      style={{
        padding: "0 16px",
        background: "color-mix(in srgb, var(--toolbar) 90%, transparent)",
        borderTop: "1px solid var(--border)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <span
        className="text-[11px] font-medium tracking-[0.01em]"
        style={{ color: "var(--text-secondary)" }}
      >
        {itemCount} {itemCount === 1 ? "Item" : "Items"}
      </span>

      <span
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[11px] font-medium"
        style={{ color: "var(--text-muted)" }}
      >
        {location}
      </span>

      <span
        className="text-[11px] font-medium capitalize tracking-[0.01em]"
        style={{ color: "var(--text-secondary)" }}
      >
        {viewMode} View
      </span>
    </footer>
  );
}