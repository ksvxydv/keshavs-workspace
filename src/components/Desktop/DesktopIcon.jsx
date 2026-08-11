import { icons } from "../../data/icons";

export default function DesktopIcon({ name, onOpen, selected, onSelect }) {
  const icon = icons[name.toLowerCase()];

  return (
    <button
      type="button"
      onClick={onSelect}
      onDoubleClick={onOpen}
      className="group flex w-24 select-none flex-col items-center gap-2"
    >
      <div className="w-20 h-20 flex items-center justify-center transition duration-200 group-hover:scale-105">
        <img
          src={icon}
          alt={name}
          draggable={false}
          className="h-16 w-16 select-none object-contain pointer-events-none transition-transform duration-200"
        />
      </div>

      <span
        className={`rounded-md px-2 py-0.5 text-sm transition-colors ${
          selected ? "bg-[color:var(--accent)] text-white" : "text-white drop-shadow"
        }`}
      >
        {name}
      </span>
    </button>
  );
}
