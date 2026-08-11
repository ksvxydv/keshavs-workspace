import { useDesktopSettings } from "../context/useDesktopSettings";
import { wallpapers } from "../data/wallpapers";

export default function Wallpapers() {
  const { wallpaper, setWallpaper } = useDesktopSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Wallpapers</h1>
        <p
          className="mt-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Choose a wallpaper for your K-OS desktop.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wallpapers.map((item) => (
          <button
            key={item.id}
            type="button"
            className="rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            onClick={() => setWallpaper(item)}
            style={{
              background: "var(--window)",
              borderColor:
                wallpaper.id === item.id
                  ? "var(--accent)"
                  : "var(--border)",
            }}
          >
            <div
              className="mb-4 h-28 w-full overflow-hidden rounded-xl border"
              style={{ borderColor: "var(--border)" }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                draggable={false}
              />
            </div>
            <h2 className="font-semibold">{item.name}</h2>
            <p
              className="mt-2 text-sm"
              style={{
                color:
                  wallpaper.id === item.id
                    ? "var(--accent)"
                    : "var(--text-secondary)",
              }}
            >
              {wallpaper.id === item.id ? "Selected" : "Click to apply"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}