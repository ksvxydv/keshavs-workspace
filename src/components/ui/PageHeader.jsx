export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = "",
}) {
  return (
    <header
      className={`flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between ${className}`}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p
            className="text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--accent)" }}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h1>

        {description && (
          <p
            className="mt-3 max-w-2xl text-sm leading-6 sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}