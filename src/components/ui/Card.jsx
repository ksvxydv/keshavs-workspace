export default function Card({
  children,
  className = "",
  interactive = false,
  style = {},
}) {
  return (
    <div
      className={`h-full rounded-2xl border p-6 transition-all duration-200 ${
        interactive ? "hover:-translate-y-0.5 hover:shadow-lg" : ""
      } ${className}`}
      style={{
        background: "color-mix(in srgb, var(--window) 82%, transparent)",
        borderColor: "color-mix(in srgb, var(--border) 82%, transparent)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)",
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
