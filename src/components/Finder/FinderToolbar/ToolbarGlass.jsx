

import React from 'react';

export default function ToolbarGlass({ children, className = '' }) {
  return (
    <div
      className={`relative flex h-[58px] items-center gap-3 border-b px-3 ${className}`}
      style={{
        background: 'color-mix(in srgb, var(--window) 82%, transparent)',
        borderColor: 'color-mix(in srgb, var(--border) 90%, transparent)',
        backdropFilter: 'blur(26px) saturate(180%)',
        WebkitBackdropFilter: 'blur(26px) saturate(180%)',
        boxShadow:
          'inset 0 -1px 0 color-mix(in srgb, var(--border) 75%, transparent)',
      }}
    >
      {children}
    </div>
  );
}