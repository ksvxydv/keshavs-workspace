import React from "react";
import FileIcon from "../FileIcon";

export default function FinderListItem({
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
      ref={(el) => registerItemRef(item.id, el)}
      className="group flex items-center gap-4 rounded-xl px-4 py-3 w-full transition-all duration-200"
      style={{
        border: "1px solid transparent",
        borderRadius: 12,
        color: "var(--text)",
        backgroundColor: selected
          ? "color-mix(in srgb, var(--accent) 10%, transparent)"
          : "transparent",
        boxShadow: selected ? `0 0 0 1px var(--accent)` : "none",
      }}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onDoubleClick={() => onOpen({ item, openItem, openDirectory })}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        onSelect(item.id);
      }}
      onContextMenu={(e) => onContextMenu(e, item)}
      tabIndex={0}
      type="button"
    >
      <FileIcon item={item} size={48} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <span className="text-sm font-semibold truncate">{item.displayName ?? item.name}</span>
      </div>
      <div className="w-32 text-xs text-neutral-500 dark:text-neutral-400 truncate">{item.type}</div>
      <div className="w-32 text-xs text-right text-neutral-400 dark:text-neutral-500 truncate">
        {item.technology ?? item.tech ?? item.stack ?? "—"}
      </div>
    </button>
  );
}