import { useEffect, useState } from "react";

export default function useFinderSelection({ items = [], itemRefs } = {}) {
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!selectedItem) return;
    itemRefs?.current?.[selectedItem]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [selectedItem, itemRefs]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!items || items.length === 0) return;
      // ArrowLeft: select previous item
      if (e.key === "ArrowLeft") {
        const idx = items.findIndex((item) => item.id === selectedItem);
        if (idx > 0) {
          setSelectedItem(items[idx - 1].id);
        } else if (idx === 0) {
          setSelectedItem(items[0].id);
        }
        if (idx >= 0) e.preventDefault();
      }
      // ArrowRight: select next item or first if none
      else if (e.key === "ArrowRight") {
        const idx = items.findIndex((item) => item.id === selectedItem);
        if (idx === -1) {
          setSelectedItem(items[0].id);
        } else if (idx < items.length - 1) {
          setSelectedItem(items[idx + 1].id);
        } else if (idx === items.length - 1) {
          setSelectedItem(items[items.length - 1].id);
        }
        e.preventDefault();
      }
      // Ctrl+A or Cmd+A: select first item
      else if (
        (e.key === "a" || e.key === "A") &&
        (e.ctrlKey || e.metaKey)
      ) {
        e.preventDefault();
        if (items.length > 0) {
          setSelectedItem(items[0].id);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items, selectedItem]);

  const selectSingleItem = (id) => {
    setSelectedItem(id);
  };

  return {
    selectedItem,
    setSelectedItem: selectSingleItem,
  };
}
