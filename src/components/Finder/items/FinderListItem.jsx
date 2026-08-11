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
      type="button"
      draggable
      tabIndex={0}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onDoubleClick={() => onOpen({ item, openItem, openDirectory })}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        onSelect(item.id);
      }}
      onContextMenu={(e) => onContextMenu(e, item)}
      className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200"
      style={{
        border: "1px solid transparent",
        borderRadius: 12,
        color: "var(--text)",
        backgroundColor: selected
          ? "color-mix(in srgb, var(--accent) 10%, transparent)"
          : "transparent",
        boxShadow: selected
          ? "0 0 0 1px color-mix(in srgb, var(--accent) 60%, transparent)"
          : "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.backgroundColor = "var(--hover)";
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <FileIcon item={item} size={40} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <span
          className="truncate text-sm font-semibold"
          style={{ color: "var(--text)" }}
        >
          {item.displayName ?? item.name}
        </span>
      </div>
      <div
        className="w-32 truncate text-xs"
        style={{ color: "var(--text-secondary)" }}
      >
        {item.type}
      </div>
      <div
        className="w-32 truncate text-right text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        {item.technology ?? item.tech ?? item.stack ?? "—"}
      </div>
    </button>
  );
}