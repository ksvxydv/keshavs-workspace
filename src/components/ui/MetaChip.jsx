const toneStyles = {
  neutral: {
    background: "color-mix(in srgb, var(--window-secondary) 82%, transparent)",
    borderColor: "color-mix(in srgb, var(--border) 82%, transparent)",
    color: "var(--text-secondary)",
  },
  accent: {
    background:
      "color-mix(in srgb, var(--accent) 14%, var(--window-secondary) 86%)",
    borderColor: "color-mix(in srgb, var(--accent) 32%, transparent)",
    color: "var(--accent)",
  },
};

export default function MetaChip({
  children,
  tone = "neutral",
  className = "",
  style = {},
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${className}`}
      style={{
        ...toneStyles[tone],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
