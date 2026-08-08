import { getTerminalActions } from "../../../terminal/terminalActions";

export function openFinderItem({ item, openItem, openDirectory }) {
  if (!item) return;

  if (openItem) {
    openItem(item);
    return;
  }

  switch (item.type) {
    case "directory":
      openDirectory?.(item.id);
      break;

    case "page":
      getTerminalActions().openWindow?.(item.page);
      break;

    case "app":
      getTerminalActions().openWindow?.(item.app);
      break;

    default:
      break;
  }
}
