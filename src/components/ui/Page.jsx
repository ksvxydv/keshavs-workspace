export default function Page({ children, className = "", style = {} }) {
  return (
    <div
      className={`h-full w-full p-4 lg:p-5 transition-colors duration-300 ${className}`}
      style={{
        background: "var(--window-secondary)",
        color: "var(--text)",
        ...style,
      }}
    >
      <div
        className="h-full w-full overflow-hidden rounded-2xl border"
        style={{
          borderColor: "color-mix(in srgb, var(--border) 85%, transparent)",
          background: "color-mix(in srgb, var(--window) 96%, transparent)",
          boxShadow: "0 20px 40px rgba(0,0,0,.08)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
