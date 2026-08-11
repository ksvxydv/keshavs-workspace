import { useRef, useState } from "react";
import FileIcon from "./FileIcon";

export default function GetInfoModal({ item, currentPath, onClose }) {
  const [showTrafficIcons, setShowTrafficIcons] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });
  if (!item) return null;

  const rows = [
    { label: "Type",     value: item.type },
    { label: "Location", value: currentPath },
    { label: "ID",       value: item.id },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.25)",
        zIndex: 5000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 360,
          borderRadius: 14,
          overflow: "hidden",
          background: "var(--glass)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          color: "var(--text)",
          boxShadow: "0 20px 60px rgba(0,0,0,.35)",
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {/* Title bar */}
        <div
          onMouseEnter={() => setShowTrafficIcons(true)}
          onMouseLeave={() => setShowTrafficIcons(false)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 14px",
            borderBottom: "1px solid var(--border)",
            userSelect: "none",
            cursor: "grab",
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            dragRef.current.dragging = true;
            e.currentTarget.style.cursor = "grabbing";
            dragRef.current.offsetX = e.clientX - position.x;
            dragRef.current.offsetY = e.clientY - position.y;

            const move = (ev) => {
              if (!dragRef.current.dragging) return;
              setPosition({
                x: ev.clientX - dragRef.current.offsetX,
                y: ev.clientY - dragRef.current.offsetY,
              });
            };

            const up = () => {
              if (e.currentTarget) e.currentTarget.style.cursor = "grab";
              dragRef.current.dragging = false;
              window.removeEventListener("mousemove", move);
              window.removeEventListener("mouseup", up);
            };

            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { color: "#ff5f57", symbol: "×", action: onClose },
              { color: "#febc2e", symbol: "−", action: null },
              { color: "#28c840", symbol: "↗", action: null },
            ].map(({ color, symbol, action }) => (
              <button
                key={color}
                type="button"
                tabIndex={-1}
                style={{
                  width: 12, height: 12,
                  borderRadius: "50%",
                  border: "none", padding: 0,
                  cursor: action ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700,
                  color: "rgba(0,0,0,.65)",
                  background: color,
                }}
                onClick={action ?? undefined}
              >
                {showTrafficIcons ? symbol : null}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, textAlign: "center", fontWeight: 600, color: "var(--text)" }}>
            Get Info
          </div>
          <div style={{ width: 44 }} />
        </div>

        {/* Content */}
        <div style={{ padding: 24, textAlign: "center" }}>
          <FileIcon item={item} size={72} />
          <h3
            style={{
              margin: "14px 0 20px",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            {item.name}
          </h3>

          <table
            style={{
              width: "100%",
              fontSize: 13,
              borderSpacing: 0,
              textAlign: "left",
            }}
          >
            <tbody>
              {rows.map(({ label, value }) => (
                <tr
                  key={label}
                  style={{ borderBottom: "1px solid var(--border-soft)" }}
                >
                  <td
                    style={{
                      padding: "8px 0",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      width: "36%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </td>
                  <td
                    style={{
                      padding: "8px 0 8px 12px",
                      color: "var(--text)",
                      wordBreak: "break-all",
                    }}
                  >
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}