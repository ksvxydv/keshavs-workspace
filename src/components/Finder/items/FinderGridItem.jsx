import FileIcon from "../FileIcon";

export default function FinderGridItem({
  item,
  index,
  selected,

  onSelect,

  onOpen,

  openItem,
  openDirectory,

  registerItemRef,

  onDragStart,
  onDragOver,
  onDrop,

  onContextMenu,
}) {
  return (
    <button
      type="button"
      draggable
      ref={(el) => registerItemRef(item.id, el)}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onDoubleClick={() =>
        onOpen({
          item,
          openItem,
          openDirectory,
        })
      }
      onClick={(e) => {
        if (e.defaultPrevented) return;

        onSelect(item.id);
      }}
      onContextMenu={(e) => onContextMenu(e, item)}
      className={`group flex w-36 transform-gpu flex-col items-center rounded-2xl p-4 transition-all duration-200 ease-out will-change-transform ${
        selected
          ? "scale-[1.03] ring-2 ring-[color:var(--accent)]/30"
          : "hover:-translate-y-1 hover:scale-[1.03]"
      }`}
      style={{
        background: selected
          ? "color-mix(in srgb, var(--accent) 16%, transparent)"
          : "transparent",
        color: "var(--text)",
        borderRadius: "14px",
        border: selected
          ? "1px solid color-mix(in srgb, var(--accent) 60%, transparent)"
          : "1px solid transparent",
        boxShadow: selected
          ? "0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent), 0 14px 34px color-mix(in srgb, var(--accent) 18%, transparent)"
          : "none",
      }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-xl transform-gpu transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105"
        style={{
          color: "var(--accent)",
        }}
      >
        <FileIcon item={item} size={60} />
      </div>

      <span
        className="mt-3 min-h-[2.6rem] w-full text-center text-sm font-medium leading-5 line-clamp-2"
        title={item.displayName ?? item.name}
      >
        {item.displayName ?? item.name}
      </span>
    </button>
  );
}
