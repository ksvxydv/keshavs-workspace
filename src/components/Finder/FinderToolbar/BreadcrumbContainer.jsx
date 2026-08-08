import React from "react";

/**
 * Tahoe-style breadcrumb container.
 * Purely visual container for breadcrumb row.
 */
const BreadcrumbContainer = ({ children }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 flex-1 items-center justify-center overflow-hidden px-2"
    >
      <div
        className="flex min-w-0 items-center gap-1 overflow-hidden rounded-xl px-2 py-1 text-[13px] font-medium tracking-[-0.01em]"
        style={{
          color: "var(--text-secondary)",
          transition: "all 180ms ease",
        }}
      >
        {children}
      </div>
    </nav>
  );
};

export default BreadcrumbContainer;