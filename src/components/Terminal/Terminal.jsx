import { useMemo, useState } from "react";
import { useDesktopSettings } from "../../context/useDesktopSettings";
import WindowFrame from "../../core/window/WindowFrame";
import { parseCommand } from "../../terminal/parser";
import { commands } from "../../terminal/command";
import TerminalInput from "./TerminalInput";
import TerminalOutput from "./TerminalOutput";
import { registerTerminalActions } from "../../terminal/terminalActions";

export default function Terminal(props) {
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [history, setHistory] = useState([
    "Welcome to K-OS Terminal",
    "Type 'help' to see available commands.",
    "",
  ]);

  const { theme } = useDesktopSettings();

  registerTerminalActions({
    history: () => commandHistory,
  });

  function handleCommand() {
    if (input.trim()) {
      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
    }
    const parsed = parseCommand(input);
    const nextHistory = [...history, `K-OS % ${input}`];

    if (parsed.error) {
      setHistory([...nextHistory, parsed.error]);
      setInput("");
      return;
    }

    if (!parsed.command) {
      setInput("");
      return;
    }

    const command = commands.find(
      (cmd) => cmd.name === parsed.command
    );

    if (!command) {
      setHistory([
        ...nextHistory,
        `Command not found: ${parsed.command}`,
        "",
      ]);
      setInput("");
      return;
    }

    const result = command.execute(parsed.args);

    if (result.clear) {
      setHistory([]);
      setInput("");
      return;
    }

    setHistory([
      ...nextHistory,
      ...(result.output || []),
      "",
    ]);

    setInput("");
  }

  function handleHistoryUp() {
    if (commandHistory.length === 0) return;

    const nextIndex =
      historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);

    setHistoryIndex(nextIndex);
    setInput(commandHistory[nextIndex]);
  }

  function handleHistoryDown() {
    if (historyIndex === -1) return;

    const nextIndex = historyIndex + 1;

    if (nextIndex >= commandHistory.length) {
      setHistoryIndex(-1);
      setInput("");
      return;
    }

    setHistoryIndex(nextIndex);
    setInput(commandHistory[nextIndex]);
  }

  const availableCommands = useMemo(
    () => [
      "help",
      "whoami",
      "date",
      "clear",
      "finder",
      "settings",
    ],
    []
  );

  function handleAutocomplete() {
    const value = input.trim().toLowerCase();

    if (!value) return;

    const matches = availableCommands.filter((command) =>
      command.startsWith(value)
    );

    if (matches.length === 1) {
      setInput(matches[0]);
    }
  }

  return (
    <WindowFrame title="Terminal" {...props}>
      <div
        className="flex h-full flex-col p-4 font-mono text-sm"
        style={{
          background: theme === "dark" ? "#0d0d0d" : "var(--window-secondary)",
          color: theme === "dark" ? "#4ade80" : "var(--text)",
        }}
      >
        <TerminalOutput history={history} />

        <TerminalInput
          value={input}
          onChange={setInput}
          onSubmit={handleCommand}
          onHistoryUp={handleHistoryUp}
          onHistoryDown={handleHistoryDown}
          onAutocomplete={handleAutocomplete}
        />
      </div>
    </WindowFrame>
  );
}
