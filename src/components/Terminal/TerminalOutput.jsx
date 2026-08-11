import { useEffect, useRef } from "react";
import { useDesktopSettings } from "../../context/useDesktopSettings";

export default function TerminalOutput({ history }) {
  const outputRef = useRef(null);
  const { theme } = useDesktopSettings();

  useEffect(() => {
    const container = outputRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  return (
    <div
      ref={outputRef}
      className={`flex-1 overflow-y-auto space-y-1 font-mono text-sm ${
        theme === "dark"
          ? "text-green-400"
          : "text-black"
      }`}
    >
      {history.map((line, index) => (
        <div
          key={index}
          className="whitespace-pre-wrap break-words"
        >
          {line}
        </div>
      ))}
    </div>
  );
}