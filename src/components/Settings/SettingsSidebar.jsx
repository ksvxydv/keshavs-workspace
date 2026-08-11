import { Paintbrush, Image as ImageIcon, LayoutTemplate, SlidersHorizontal, Info } from "lucide-react";

const sections = [
  { id: "Appearance", label: "Appearance", icon: Paintbrush },
  { id: "Wallpapers", label: "Wallpapers", icon: ImageIcon },
  { id: "Dock",       label: "Dock",       icon: LayoutTemplate },
  { id: "Personalize",label: "Personalize",icon: SlidersHorizontal },
  { id: "About",      label: "About",      icon: Info },
];

export default function SettingsSidebar({ active, setActive }) {
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
      <div className="px-4 pt-5 pb-3">
        <h2
          className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--text-muted)" }}
        >
          Settings
        </h2>

        <div className="space-y-0.5">
          {sections.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all duration-150"
                style={{
                  background: isActive
                    ? "color-mix(in srgb, var(--accent) 16%, transparent)"
                    : "transparent",
                  color: isActive ? "var(--text)" : "var(--text-secondary)",
                  boxShadow: isActive
                    ? "0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "var(--hover)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className="shrink-0 transition-transform duration-150 group-hover:scale-110"
                  style={{ color: isActive ? "var(--accent)" : "inherit" }}
                />
                <span className="text-[13px] font-medium tracking-tight">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
