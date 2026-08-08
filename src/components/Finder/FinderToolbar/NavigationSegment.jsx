import React from 'react';
import { FaChevronLeft, FaChevronRight, FaHome } from 'react-icons/fa';
import ToolbarButton from './ToolbarButton';

export default function NavigationSegment({
  goBack,
  goForward,
  goHome,
  canGoBack,
  canGoForward,
  compact = false,
}) {
  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-2xl border p-1"
      style={{
        background: 'color-mix(in srgb, var(--window) 60%, transparent)',
        borderColor: 'color-mix(in srgb, var(--border) 45%, transparent)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,.08), inset 0 -1px 0 rgba(0,0,0,.05)',
      }}
    >
      <div className="flex items-center divide-x divide-white/10 dark:divide-white/5">
        <ToolbarButton
          onClick={goBack}
          disabled={!canGoBack}
          aria-label="Go back"
          className="mx-0.5"
        >
          <FaChevronLeft />
        </ToolbarButton>
        <ToolbarButton
          onClick={goForward}
          disabled={!canGoForward}
          aria-label="Go forward"
          className="mx-0.5"
        >
          <FaChevronRight />
        </ToolbarButton>
        {!compact && (
          <ToolbarButton onClick={goHome} aria-label="Go home" className="mx-0.5">
            <FaHome />
          </ToolbarButton>
        )}
      </div>
    </div>
  );
}
