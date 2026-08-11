import { useDesktopSettings } from "../context/useDesktopSettings";

export default function DockSettings() {
  const { dockSize, setDockSize, dockMagnification, setDockMagnification } =
    useDesktopSettings();

  return (
    <div className="space-y-8">
      <div>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--accent)" }}
        >
          Settings
        </p>
        <h1 className="mt-1 text-4xl font-bold">Dock</h1>
        <p
          className="mt-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Configure Dock behavior and appearance.
        </p>
      </div>

      <section
        className="rounded-2xl border p-6"
        style={{
          background: "var(--window)",
          borderColor: "var(--border)",
        }}
      >
        <div className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Size</h2>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Adjust the base size of the Dock icons.
              </p>
            </div>
            <div className="flex w-full sm:w-64 shrink-0 items-center gap-3">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Small
              </span>
              <input
                type="range"
                min="32"
                max="96"
                value={dockSize}
                onChange={(e) => setDockSize(parseInt(e.target.value, 10))}
                className="brightness-slider h-1.5 flex-1 min-w-0 appearance-none rounded-full"
                style={{
                  background: "var(--border)",
                  outline: "none",
                }}
              />
              <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                Large
              </span>
            </div>
          </div>

          <div
            className="h-px w-full"
            style={{ background: "var(--border)" }}
          />

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Magnification</h2>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Enlarge Dock icons when hovering over them.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDockMagnification(!dockMagnification)}
              className="relative h-6 w-11 rounded-full transition-colors duration-200"
              style={{
                background: dockMagnification
                  ? "var(--accent)"
                  : "var(--border)",
              }}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${dockMagnification ? "translate-x-5" : "translate-x-0"}`}
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
