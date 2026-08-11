

import { useDesktopSettings } from "../context/useDesktopSettings";

export default function Personalize() {
  const {
    twentyFourHourTime,
    setTwentyFourHourTime,
    showDesktopIcons,
    setShowDesktopIcons,
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
        <h1 className="mt-1 text-4xl font-bold">Personalize</h1>
        <p
          className="mt-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Customize your K-OS experience.
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
              <h2 className="text-lg font-semibold">24-Hour Time</h2>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Use a 24-hour clock in the menu bar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTwentyFourHourTime(!twentyFourHourTime)}
              className="relative h-6 w-11 rounded-full transition-colors duration-200"
              style={{
                background: twentyFourHourTime
                  ? "var(--accent)"
                  : "var(--border)",
              }}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${twentyFourHourTime ? "translate-x-5" : "translate-x-0"}`}
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
              />
            </button>
          </div>

          <div
            className="h-px w-full"
            style={{ background: "var(--border)" }}
          />

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Desktop Icons</h2>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Show folders and files on the desktop.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDesktopIcons(!showDesktopIcons)}
              className="relative h-6 w-11 rounded-full transition-colors duration-200"
              style={{
                background: showDesktopIcons
                  ? "var(--accent)"
                  : "var(--border)",
              }}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${showDesktopIcons ? "translate-x-5" : "translate-x-0"}`}
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}