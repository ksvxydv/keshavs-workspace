import { House, Grid2x2, FileText, Briefcase, Download } from "lucide-react";

const sections = [
  {
    title: "Favorites",
    items: [
      { id: "home",         label: "Home",         icon: House },
      { id: "applications", label: "Applications", icon: Grid2x2 },
      { id: "documents",   label: "Documents",    icon: FileText },
      { id: "downloads",   label: "Downloads",    icon: Download },
    ],
  },
  {
    title: "Portfolio",
    items: [{ id: "portfolio", label: "Portfolio", icon: Briefcase }],
  },
];

export default function FinderSidebar({ currentPath, goHome, openRootDirectory }) {
  return (
    <aside
      className="flex h-full w-56 flex-col overflow-hidden border-r transition-all duration-300"
      style={{
        background: "color-mix(in srgb, var(--sidebar) 94%, transparent)",
        borderColor: "color-mix(in srgb, var(--border) 88%, transparent)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
      }}
    >
      {sections.map(({ title, items }) => (
        <div key={title} className="px-4 pt-5 pb-3">
          {/* Section heading */}
          <p
            className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--text-muted)" }}
          >
            {title}
          </p>

          <div className="space-y-0.5">
            {items.map(({ id, label, icon: Icon }) => {
              const path = currentPath.toLowerCase();
              const selected =
                id === "home" ? currentPath === "/" : path.includes(id);

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    if (id === "home") { goHome(); return; }
                    openRootDirectory(id);
                  }}
                  className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all duration-150"
                  style={{
                    background: selected
                      ? "color-mix(in srgb, var(--accent) 16%, transparent)"
                      : "transparent",
                    color: selected ? "var(--text)" : "var(--text-secondary)",
                    boxShadow: selected
                      ? "0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected)
                      e.currentTarget.style.background = "var(--hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!selected)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={selected ? 2.2 : 1.8}
                    className="shrink-0 transition-transform duration-150 group-hover:scale-110"
                    style={{ color: selected ? "var(--accent)" : "inherit" }}
                  />
                  <span className="text-[13px] font-medium tracking-tight">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div
        className="mt-auto border-t px-4 py-4"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in srgb, var(--sidebar) 96%, transparent)",
        }}
      >
        <p
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          K_OS File System
        </p>
      </div>
    </aside>
  );
}
