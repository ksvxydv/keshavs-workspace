import React, { forwardRef } from 'react';

/**
 * ToolbarGlass — frosted-glass toolbar container.
 * Uses forwardRef so parent components (e.g. FinderToolbar) can attach a
 * ResizeObserver to the underlying DOM node for responsive compact mode.
 */
const ToolbarGlass = forwardRef(function ToolbarGlass(
  { children, className = '', style = {}, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={`relative flex h-[52px] shrink-0 items-center gap-3 border-b px-4 ${className}`}
      style={{
        background: 'color-mix(in srgb, var(--toolbar) 92%, transparent)',
        borderColor: 'color-mix(in srgb, var(--border) 90%, transparent)',
        backdropFilter: 'blur(26px) saturate(180%)',
        WebkitBackdropFilter: 'blur(26px) saturate(180%)',
        boxShadow:
          'inset 0 -1px 0 color-mix(in srgb, var(--border) 75%, transparent)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

export default ToolbarGlass;