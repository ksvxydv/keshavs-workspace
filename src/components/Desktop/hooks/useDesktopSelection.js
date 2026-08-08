import { useCallback, useRef, useState } from "react";

function createSelectionRect(startX, startY, currentX, currentY) {
  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);

  return {
    left,
    top,
    width: Math.abs(currentX - startX),
    height: Math.abs(currentY - startY),
    right: Math.max(startX, currentX),
    bottom: Math.max(startY, currentY),
  };
}

function intersects(selectionRect, elementRect) {
  return (
    selectionRect.left <= elementRect.right &&
    selectionRect.right >= elementRect.left &&
    selectionRect.top <= elementRect.bottom &&
    selectionRect.bottom >= elementRect.top
  );
}

function selectionMatches(currentSelection, nextSelection) {
  if (currentSelection.size !== nextSelection.size) return false;

  return [...currentSelection].every((id) => nextSelection.has(id));
}

export default function useDesktopSelection() {
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [selectionRect, setSelectionRect] = useState(null);
  const selectedIdsRef = useRef(selectedIds);
  const iconElementsRef = useRef(new Map());
  const pointerSelectionRef = useRef(null);

  const updateSelection = useCallback((nextSelection) => {
    if (selectionMatches(selectedIdsRef.current, nextSelection)) return;

    selectedIdsRef.current = nextSelection;
    setSelectedIds(nextSelection);
  }, []);

  const clearSelection = useCallback(() => {
    updateSelection(new Set());
  }, [updateSelection]);

  const selectOnly = useCallback(
    (id) => {
      updateSelection(new Set([id]));
    },
    [updateSelection],
  );

  const registerIcon = useCallback((id, element) => {
    if (element) {
      iconElementsRef.current.set(id, element);
      return;
    }

    iconElementsRef.current.delete(id);
  }, []);

  const selectIcon = useCallback(
    (id, event) => {
      event.stopPropagation();

      if (!event.metaKey) {
        updateSelection(new Set([id]));
        return;
      }

      const nextSelection = new Set(selectedIdsRef.current);

      if (nextSelection.has(id)) {
        nextSelection.delete(id);
      } else {
        nextSelection.add(id);
      }

      updateSelection(nextSelection);
    },
    [updateSelection],
  );

  const handlePointerDown = useCallback(
    (event) => {
      if (event.button !== 0) return;
      if (event.target.closest?.("[data-desktop-icon]")) return;

      const surfaceRect = event.currentTarget.getBoundingClientRect();

      pointerSelectionRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        surfaceRect,
        initialSelection: new Set(selectedIdsRef.current),
        shouldAppend: event.metaKey,
      };

      if (!event.metaKey) {
        clearSelection();
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    },
    [clearSelection],
  );

  const handlePointerMove = useCallback(
    (event) => {
      const pointerSelection = pointerSelectionRef.current;

      if (!pointerSelection || pointerSelection.pointerId !== event.pointerId) {
        return;
      }

      const viewportRect = createSelectionRect(
        pointerSelection.startX,
        pointerSelection.startY,
        event.clientX,
        event.clientY,
      );

      setSelectionRect({
        left: viewportRect.left - pointerSelection.surfaceRect.left,
        top: viewportRect.top - pointerSelection.surfaceRect.top,
        width: viewportRect.width,
        height: viewportRect.height,
      });

      const nextSelection = pointerSelection.shouldAppend
        ? new Set(pointerSelection.initialSelection)
        : new Set();

      iconElementsRef.current.forEach((element, id) => {
        if (intersects(viewportRect, element.getBoundingClientRect())) {
          nextSelection.add(id);
        }
      });

      updateSelection(nextSelection);
    },
    [updateSelection],
  );

  const finishPointerSelection = useCallback((event) => {
    const pointerSelection = pointerSelectionRef.current;

    if (!pointerSelection || pointerSelection.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    pointerSelectionRef.current = null;
    setSelectionRect(null);
  }, []);

  return {
    selectedIds,
    selectionRect,
    registerIcon,
    selectIcon,
    selectOnly,
    clearSelection,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: finishPointerSelection,
    handlePointerCancel: finishPointerSelection,
  };
}
