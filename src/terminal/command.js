import {
  getCurrentPath,
  listCurrentDirectory,
  changeDirectory,
  findItemInCurrentDirectory,
} from "./shell";
import { getTerminalActions } from "./terminalActions";
import {
  SUPPORTED_THEMES,
  SUPPORTED_ACCENTS,
  SUPPORTED_WALLPAPERS,
} from "./constants";
export const commands = [
  {
    name: "help",
    description: "List all available commands",
    execute: () => ({
      output: [
        "Available commands:",
        "",
        "help      - Show this help menu",
        "whoami    - About the developer",
        "date      - Show current date and time",
        "open <item>       - Open a file or application",
        "pwd               - Print current directory",
        "ls                - List directory contents",
        "cd <directory>    - Change current directory",
        "theme <mode>      - Change theme (dark/light)",
        "accent <color>    - Change accent color",
        "wallpaper <name>  - Change wallpaper",
        "history   - Show command history",
        "neofetch  - Show K-OS system information",
        "clear     - Clear the terminal",
      ],
    }),
  },
  {
    name: "whoami",
    description: "Display developer information",
    execute: () => ({
      output: [
        "Keshav",
        "Computer Science & Engineering Student",
        "Software Developer",
      ],
    }),
  },
  {
    name: "date",
    description: "Show current date and time",
    execute: () => ({
      output: [new Date().toString()],
    }),
  },
  {
    name: "open",
    description: "Open a file or application",
    execute: (args) => {
      const target = args.join(" ").trim();

      if (!target) {
        return {
          output: ["Usage: open <file | application>"],
        };
      }

      const item = findItemInCurrentDirectory(target);

      if (!item) {
        return {
          output: [`Item not found: ${target}`],
        };
      }

      switch (item.type) {
        case "app":
          getTerminalActions().openWindow?.(item.app);
          return {
            output: [`Opening ${item.name}...`],
          };

        case "file":
          return {
            output: [`Opening ${item.name}...`],
          };

        case "project":
          return {
            output: [`Opening project: ${item.name}`],
          };

        default:
          return {
            output: [`Cannot open ${item.name}`],
          };
      }
    },
  },
  {
    name: "theme",
    description: "Change desktop theme",
    execute: (args) => {
      const theme = (args[0] || "").toLowerCase();

      if (!SUPPORTED_THEMES.includes(theme)) {
        return {
          output: ["Usage: theme <dark|light>"],
        };
      }

      getTerminalActions().setTheme?.(theme);

      return {
        output: [`Theme changed to ${theme}.`],
      };
    },
  },
  {
    name: "accent",
    description: "Change accent color",
    execute: (args) => {
      const color = (args[0] || "").toLowerCase();

      if (!SUPPORTED_ACCENTS.includes(color)) {
        return {
          output: [
            `Unknown accent: ${color}`,
            `Available: ${SUPPORTED_ACCENTS.join(", ")}`,
          ],
        };
      }

      getTerminalActions().setAccentColor?.(color);

      return {
        output: [`Accent changed to ${color}.`],
      };
    },
  },
  {
    name: "wallpaper",
    description: "Change wallpaper",
    execute: (args) => {
      const wallpaperId = (args[0] || "").toLowerCase();

      if (!SUPPORTED_WALLPAPERS.includes(wallpaperId)) {
        return {
          output: [
            `Unknown wallpaper: ${wallpaperId}`,
            `Available: ${SUPPORTED_WALLPAPERS.join(", ")}`,
          ],
        };
      }

      // We need to pass the full wallpaper object to setWallpaper
      import("../data/wallpapers").then(({ wallpapers }) => {
        const wallpaperObj = wallpapers.find(w => w.id === wallpaperId);
        if (wallpaperObj) {
          getTerminalActions().setWallpaper?.(wallpaperObj);
        }
      });

      return {
        output: [`Wallpaper changed to ${wallpaperId}.`],
      };
    },
  },
  {
    name: "neofetch",
    description: "Display K-OS system information",
    execute: () => ({
      output: [
        "",
        "        .:'",
        "    __ :'__",
        " .'`  `-'  ``.",
        ":          .-'",
        ":         :",
        " :         `-;",
        "  `.__.-.__.'",
        "",
        "K-OS 1.0",
        "──────────────────────────────",
        `Developer : Keshav`,
        `Framework : React`,
        `Language  : JavaScript`,
        `Animations: Framer Motion`,
        `Theme     : ${getTerminalActions().theme?.() ?? "Unknown"}`,
        `Wallpaper : ${getTerminalActions().currentWallpaper?.() ?? "Unknown"}`,
        `Windows   : ${getTerminalActions().openWindowCount?.() ?? 0}`,
        `Directory : ${getCurrentPath()}`,
        `Desktop   : K-OS`,
        "",
      ],
    }),
  },
  {
    name: "fetch",
    description: "Alias for neofetch",
    execute: () => commands.find(c => c.name === "neofetch").execute(),
  },
  {
    name: "history",
    description: "Show previously executed commands",
    execute: () => {
      const history = getTerminalActions().history?.() ?? [];

      if (history.length === 0) {
        return {
          output: ["No commands executed yet."],
        };
      }

      return {
        output: history.map((command, index) => `${index + 1}. ${command}`),
      };
    },
  },
  {
    name: "pwd",
    description: "Print current working directory",
    execute: () => ({
      output: [getCurrentPath()],
    }),
  },

  {
    name: "ls",
    description: "List directory contents",
    execute: () => {
      const items = listCurrentDirectory();

      return {
        output:
          items.length === 0
            ? ["Directory is empty."]
            : items.map((item) => {
                const suffix =
                  item.type === "directory"
                    ? "/"
                    : item.type === "app"
                      ? ""
                      : "";
                return `${item.name}${suffix}`;
              }),
      };
    },
  },
  {
    name: "cd",
    description: "Change current directory",
    execute: (args) => {
      const target = args[0];

      if (!target) {
        return {
          output: ["Usage: cd <directory>"],
        };
      }

      const success = changeDirectory(target);

      if (!success) {
        return {
          output: [`Directory not found: ${target}`],
        };
      }

      return {
        output: [getCurrentPath()],
      };
    },
  },
  {
    name: "clear",
    description: "Clear the terminal",
    execute: () => ({
      clear: true,
    }),
  },
];
