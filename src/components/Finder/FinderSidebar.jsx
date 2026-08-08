import {
  House,
  Grid2x2,
  FileText,
  Briefcase,
  Monitor,
  Download,
} from "lucide-react";

const sections = [
  {
    title: 'Favorites',
    items: [
      { id: 'home', label: 'Home', icon: House },
      { id: 'applications', label: 'Applications', icon: Grid2x2 },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'downloads', label: 'Downloads', icon: Download },
    ],
  },
  {
    title: 'Portfolio',
    items: [
      { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
      { id: 'projects', label: 'Workspace', icon: Monitor },
    ],
  },
];

export default function FinderSidebar({
  currentPath,
  goHome,
  openRootDirectory,
}) {
  return (
    <aside
      className="flex h-full w-64 flex-col overflow-hidden border-r transition-all duration-300"
      style={{
        background: "color-mix(in srgb, var(--sidebar) 94%, transparent)",
        borderColor: "color-mix(in srgb, var(--border) 88%, transparent)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
      }}
    >
      {sections.map(({ title, items }) => (
        <div key={title} className="px-6 pt-6 pb-4">
          <p
            className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--text-muted)" }}
          >
            {title}
          </p>
          <div className="px-3 space-y-1">
            {items.map(({ id, label, icon: Icon }) => {
              const path = currentPath.toLowerCase();

              const selected =
                id === "home"
                  ? currentPath === "/"
                  : id === "projects"
                    ? path.includes("projects") || path.includes("workspace")
                    : path.includes(id);

              return (
                <button
                  key={id}
                  onClick={() => {
                    if (id === "home") {
                      goHome();
                      return;
                    }
                    openRootDirectory(id);
                  }}
                  className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-all duration-200 hover:translate-x-1"
                  style={{
                    background: selected
                      ? "color-mix(in srgb, var(--accent) 18%, transparent)"
                      : "transparent",
                    color: selected ? "var(--text)" : "var(--text-secondary)",
                    boxShadow: selected
                      ? "inset 0 1px 0 rgba(255,255,255,.08)"
                      : "none",
                  }}
                >
                  <Icon size={18} strokeWidth={2} className="shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-[13.5px] font-medium tracking-tight">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div
        className="mt-auto border-t px-6 py-5"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in srgb, var(--sidebar) 96%, transparent)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.04)",
        }}
      >
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          K_OS File System
        </p>
      </div>
    </aside>
  );
}
