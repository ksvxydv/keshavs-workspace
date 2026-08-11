import React, { useEffect, useId, useRef, useState } from "react";
import NavigationSegment from "./NavigationSegment";
import BreadcrumbContainer from "./BreadcrumbContainer";
import ViewSegment from "./ViewSegment";
import SearchField from "./SearchField";
import ActionButtons from "./ActionButtons";
import ToolbarGlass from "./ToolbarGlass";
import Breadcrumbs from "./Breadcrumbs";

/**
 * FinderToolbar component: Composes the Finder's toolbar with navigation, breadcrumbs, view, search, and actions.
 *
 * @param {Object} props
 * @param {string} props.currentPath
 * @param {function} props.goHome
 * @param {function} props.goBack
 * @param {function} props.goForward
 * @param {boolean} props.canGoBack
 * @param {boolean} props.canGoForward
 * @param {string} props.search
 * @param {function} props.onSearchChange
 * @param {string} props.viewMode
 * @param {function} props.onViewModeChange
 * @param {function} [props.onNavigate]
 */
export default function FinderToolbar({
  currentPath,
  goHome,
  goBack,
  goForward,
  canGoBack,
  canGoForward,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onNavigate,
}) {
  const toolbarRef = useRef(null);
  const searchInputId = useId();
  const [compact, setCompact] = useState(false);
  const [ultraCompact, setUltraCompact] = useState(false);

  useEffect(() => {
    if (!toolbarRef.current) return;
    const node = toolbarRef.current;
    const handleResize = (entries) => {
      const width = entries[0].contentRect.width;
      setCompact(width < 760);
      setUltraCompact(width < 620);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(node);
    // Initialize
    handleResize([{ contentRect: node.getBoundingClientRect() }]);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        const input = document.getElementById(searchInputId);
        if (input) {
          input.focus();
          if (typeof input.select === "function") {
            input.select();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchInputId]);

  return (
    <ToolbarGlass ref={toolbarRef}>
      <NavigationSegment
        goHome={goHome}
        goBack={goBack}
        goForward={goForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        compact={compact}
      />
      <div className="flex min-w-0 flex-1 items-center justify-start overflow-hidden">
        <div className="min-w-0 max-w-full">
          <BreadcrumbContainer>
            <Breadcrumbs
              items={
                typeof currentPath === "string"
                  ? [
                      { id: "/", name: "Home", label: "Home" },
                      ...currentPath
                        .split("/")
                        .filter(Boolean)
                        .map((segment, index, parts) => ({
                          id: "/" + parts.slice(0, index + 1).join("/"),
                          name: segment,
                          label: segment,
                        })),
                    ]
                  : currentPath
              }
              onNavigate={onNavigate}
            />
          </BreadcrumbContainer>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ViewSegment viewMode={viewMode} onViewModeChange={onViewModeChange} />
        <SearchField
          id={searchInputId}
          value={search}
          onChange={onSearchChange}
          compact={compact}
          ultraCompact={ultraCompact}
        />
        <ActionButtons compact={compact} ultraCompact={ultraCompact} />
      </div>
    </ToolbarGlass>
  );
}