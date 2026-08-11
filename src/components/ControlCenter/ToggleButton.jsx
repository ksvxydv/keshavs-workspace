export default function ToggleButton({
  icon: Icon,
  title,
  subtitle,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: active
          ? "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #fff 30%))"
          : "var(--window)",
        borderColor: active
          ? "color-mix(in srgb, var(--accent) 40%, transparent)"
          : "var(--border)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        color: active ? "#fff" : "var(--text)",
      }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          background: active
            ? "rgba(255,255,255,.22)"
            : "var(--toolbar)",
          border: active ? "none" : "1px solid var(--border)",
        }}
      >
        {Icon && <Icon size={20} />}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold">{title}</h3>
        {subtitle && (
          <p
            className="mt-0.5 truncate text-xs"
            style={{
              color: active ? "rgba(255,255,255,.82)" : "var(--text-secondary)",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </button>
  );
}