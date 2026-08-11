import { useDesktopSettings } from "../context/useDesktopSettings";
import { accentColors } from "../data/accentColors";

export default function Appearance() {
  const {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
  } = useDesktopSettings();

  return (
    <div className="space-y-8">
      <div>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--accent)" }}
        >
          Settings
        </p>
        <h1 className="mt-1 text-4xl font-bold">Appearance</h1>
        <p
          className="mt-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Customize the look and feel of K-OS.
        </p>
      </div>

      <section
        className="rounded-2xl border p-6"
        style={{
          background: "var(--window)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-xl font-semibold">Theme</h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Light", value: "light", icon: "☀️" },
            { title: "Dark", value: "dark", icon: "🌙" },
            { title: "Auto", value: "auto", icon: "💻" },
          ].map((option) => (
            <button
              key={option.title}
              type="button"
              className="rounded-xl border p-5 text-left transition hover:scale-[1.02]"
              onClick={() => setTheme(option.value)}
              style={{
                borderColor:
                  theme === option.value ? "var(--accent)" : "var(--border)",
                background:
                  theme === option.value
                    ? "color-mix(in srgb, var(--accent) 15%, var(--toolbar))"
                    : "var(--toolbar)",
              }}
            >
              <div className="text-3xl">{option.icon}</div>
              <h3 className="mt-3 font-semibold">{option.title}</h3>
              <p
                className="mt-1 text-sm"
                style={{
                  color:
                    theme === option.value
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                }}
              >
                {theme === option.value ? "Selected" : "Click to apply"}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl border p-6"
        style={{
          background: "var(--window)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-xl font-semibold">Accent Color</h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {accentColors.map((color) => {
            const selected = accentColor === color.id;

            return (
              <button
                key={color.id}
                type="button"
                onClick={() => setAccentColor(color.id)}
                className="rounded-xl border p-5 text-left transition hover:scale-[1.02]"
                style={{
                  borderColor: selected ? color.value : "var(--border)",
                  background: selected
                    ? `color-mix(in srgb, ${color.value} 15%, var(--toolbar))`
                    : "var(--toolbar)",
                }}
              >
                <div
                  className="mb-4 h-10 w-10 rounded-full border"
                  style={{
                    background: color.value,
                    borderColor: "rgba(255,255,255,.2)",
                  }}
                />

                <h3 className="font-semibold">{color.label}</h3>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: selected ? color.value : "var(--text-secondary)",
                  }}
                >
                  {selected ? "Selected" : "Click to apply"}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}