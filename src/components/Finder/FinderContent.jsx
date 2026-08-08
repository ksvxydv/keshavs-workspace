import { useEffect, useRef, useState } from "react";
import FinderGridItem from "./items/FinderGridItem";
import FinderListItem from "./items/FinderListItem";
import { openFinderItem } from "./utils/finderItemActions";
import GetInfoModal from "./GetInfoModal";
import useFinderSelection from "./hooks/useFinderSelection";
import FinderContextMenu from "./overlays/FinderContextMenu";
export default function FinderContent({
  currentPath,
  items,
  openDirectory,
  openItem,
  openPath,
  goHome,
  goBack,
  goForward,
  canGoBack,
  canGoForward,
  viewMode = "grid",
}) {
  const [gridItems, setGridItems] = useState(items);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
    anchorRect: null,
  });

  const [infoItem, setInfoItem] = useState(null);

  const mainRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    setGridItems(items);
  }, [items]);

  const {
    selectedItem,
    setSelectedItem,
  } = useFinderSelection({
    items: gridItems,
    itemRefs,
  });

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, item: null, anchorRect: null });
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu.visible]);

  useEffect(() => {
    function handleKeyDown(e) {
      // Escape: close Quick Look
      if (e.key === "Escape") {
        return;
      }

      // Enter: Open selected item
      if (e.key === "Enter") {
        const item = gridItems.find((i) => i.id === selectedItem);
        if (!item) return;
        e.preventDefault();
        openFinderItem({
          item,
          openItem,
          openDirectory,
        });
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, gridItems, openItem, openDirectory]);

  const registerItemRef = (id, el) => {
    if (el) itemRefs.current[id] = el;
    else delete itemRefs.current[id];
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDrop = (e, index) => {
    const fromIndex = parseInt(e.dataTransfer.getData("index"), 10);
    const toIndex = index;

    if (fromIndex === toIndex) return;

    const updated = [...gridItems];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    setGridItems(updated);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setSelectedItem(item.id);

    const rect = mainRef.current.getBoundingClientRect();

    setContextMenu({
      visible: true,
      x: e.clientX - rect.left + mainRef.current.scrollLeft,
      y: e.clientY - rect.top + mainRef.current.scrollTop,
      item,
      anchorRect: null,
    });
  };

  return (
    <main
      ref={mainRef}
      className="flex-1 overflow-auto px-8 pb-6 pt-4"
      style={{
        background: "var(--window-secondary)",
        color: "var(--text)",
      }}
      onClick={() => setSelectedItem(null)}
    >
      <div className="mx-auto max-w-6xl">
        {gridItems.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center select-none">
            <div className="mb-6 text-6xl opacity-50">🔍</div>
            <h2 className="text-2xl font-semibold">No Results</h2>
            <p
              className="mt-2 max-w-sm text-sm opacity-60"
              style={{ color: "var(--text-secondary, var(--text))" }}
            >
              No items match your search.
            </p>
          </div>
        ) : (
          viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 justify-items-center sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {gridItems.map((item, index) => (
                <FinderGridItem
                  key={item.id}
                  item={item}
                  index={index}
                  selected={selectedItem === item.id}
                  onSelect={setSelectedItem}
                  onOpen={openFinderItem}
                  openItem={openItem}
                  openDirectory={openDirectory}
                  registerItemRef={registerItemRef}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onContextMenu={handleContextMenu}
                />
              ))}
            </div>
          ) : (
            <div
              className="overflow-hidden rounded-2xl border"
              style={{
                borderColor: "color-mix(in srgb, var(--border) 70%, transparent)",
                background: "color-mix(in srgb, var(--window) 72%, transparent)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              <div className="grid grid-cols-[1fr_120px_130px] px-4 py-3 text-xs font-semibold uppercase opacity-60">
                <span>Name</span>
                <span>Kind</span>
                <span className="text-right">Technology</span>
              </div>
              {gridItems.map((item, index) => (
                <FinderListItem
                  key={item.id}
                  item={item}
                  index={index}
                  selected={selectedItem === item.id}
                  onSelect={setSelectedItem}
                  onOpen={openFinderItem}
                  openItem={openItem}
                  openDirectory={openDirectory}
                  registerItemRef={registerItemRef}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onContextMenu={handleContextMenu}
                />
              ))}
            </div>
          )
        )}
      </div>
      <FinderContextMenu
        contextMenu={contextMenu}
        onOpen={() =>
          openFinderItem({
            item: contextMenu.item,
            openItem,
            openDirectory,
          })
        }
        onGetInfo={() => {
          if (contextMenu.item) {
            setInfoItem(contextMenu.item);
          }
        }}
        onClose={() =>
          setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            item: null,
            anchorRect: null,
          })
        }
      />
      <GetInfoModal
        item={infoItem}
        currentPath={currentPath}
        onClose={() => setInfoItem(null)}
      />
    </main>
  );
}
