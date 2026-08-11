import folderIcon from "../../assets/icons/folders/folder.png";
import finderIcon from "../../assets/icons/apps/finder.png";
import terminalIcon from "../../assets/icons/apps/terminal.png";
import freeformIcon from "../../assets/icons/apps/freeform.png";
import settingsIcon from "../../assets/icons/apps/settings.png";
import screenSharingIcon from "../../assets/icons/apps/screenSharing.png";
import pdfIcon from "../../assets/icons/files/pdf.png";
import booksIcon from "../../assets/icons/apps/books.png";
import mailIcon from "../../assets/icons/apps/mail.png";
import gamesIcon from "../../assets/icons/apps/games.png";
import missionControlIcon from "../../assets/icons/apps/missionControl.png";
import { memo } from "react";
import { FileText, AppWindow, Link2 } from "lucide-react";

const IconImage = ({ src, alt, size }) => (
  <img
    src={src}
    alt={alt}
    draggable={false}
    width={size}
    height={size}
    className="select-none object-contain"
  />
);

function FileIcon({ item, size = 44 }) {
  if (item.type === "directory") {
    return <IconImage src={folderIcon} alt="Folder" size={size} />;
  }

  if (item.type === "app") {
    switch (item.app) {
      case "finder":
        return <IconImage src={finderIcon} alt="Finder" size={size} />;
      case "terminal":
        return <IconImage src={terminalIcon} alt="Terminal" size={size} />;
      case "settings":
        return <IconImage src={settingsIcon} alt="Settings" size={size} />;
      default:
        return <AppWindow size={size} strokeWidth={1.8} />;
    }
  }

  if (item.type === "page") {
    switch (item.page) {
      case "about":
        return <IconImage src={screenSharingIcon} alt="About" size={size} />;

      case "projects":
        return <IconImage src={missionControlIcon} alt="Projects" size={size} />;

      case "skills":
        return <IconImage src={freeformIcon} alt="Skills" size={size} />;

      case "education":
        return <IconImage src={booksIcon} alt="Education" size={size} />;

      case "achievements":
        return <IconImage src={gamesIcon} alt="Achievements" size={size} />;

      case "resume":
        return <IconImage src={pdfIcon} alt="Resume" size={size} />;

      case "contact":
        return <IconImage src={mailIcon} alt="Contact" size={size} />;

      default:
        return <FileText size={size} strokeWidth={1.8} />;
    }
  }

  if (item.type === "file") {
    if (item.name?.toLowerCase().includes("resume") || item.name?.toLowerCase().endsWith(".pdf")) {
      return <IconImage src={pdfIcon} alt="PDF" size={size} />;
    }

    return <FileText size={size} strokeWidth={1.8} />;
  }

  if (item.type === "link") {
    return <Link2 size={size} strokeWidth={1.8} />;
  }

  return <FileText size={size} strokeWidth={1.8} />;
}

export default memo(FileIcon);
