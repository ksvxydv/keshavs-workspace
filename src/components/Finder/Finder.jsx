import { useMemo, useState } from "react";
import useFileSystem from "../../terminal/useFileSystem";
import FinderSidebar from "./FinderSidebar";
import FinderContent from "./FinderContent";
import FinderToolbar from "./FinderToolbar/FinderToolbar";
import FinderStatusBar from "./FinderStatusBar";
import WindowFrame from "../../core/window/WindowFrame";

export default function Finder({
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDragStart,
  onResizeStart,
}) {
  const {
    currentPath,
    items,
    openDirectory,
    openItem,
    openRootDirectory,
    openPath,
    goHome,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
  } = useFileSystem();

  console.log("Finder currentPath:", currentPath);

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const displayItems = useMemo(() => {
    return items
      .map((item) => ({
        ...item,
        displayName: item.name.endsWith(".app")
          ? item.name.slice(0, -4)
          : item.name,
      }))
      .filter((item) => {
        if (!search.trim()) return true;
        return (item.displayName ?? item.name)
          .toLowerCase()
          .includes(search.toLowerCase());
      });
  }, [items, search]);

  return (
    <WindowFrame
      title="Finder"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onFocus={onFocus}
      onDragStart={onDragStart}
      onResizeStart={onResizeStart}
    >
      <div className="flex h-full min-h-0 items-stretch overflow-hidden">
        <FinderSidebar
          currentPath={currentPath}
          goHome={goHome}
          openRootDirectory={openRootDirectory}
        />
        <div className="relative min-w-0 flex-1 overflow-hidden flex flex-col">
          <div
            className="relative z-20 shrink-0"
            style={{ isolation: "isolate" }}
          >
            <FinderToolbar
              currentPath={currentPath}
              onNavigate={openPath}
              goHome={goHome}
              goBack={goBack}
              goForward={goForward}
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              search={search}
              onSearchChange={setSearch}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
          <div
            className="relative z-0 min-h-0 flex-1 overflow-hidden"
            style={{ contain: "layout paint" }}
          >
            <FinderContent
              currentPath={currentPath}
              items={displayItems}
              openDirectory={openDirectory}
              openItem={openItem}
              viewMode={viewMode}
            />
          </div>
          <FinderStatusBar
            itemCount={displayItems.length}
            currentPath={currentPath}
            viewMode={viewMode}
          />
        </div>
      </div>
    </WindowFrame>
  );
}
