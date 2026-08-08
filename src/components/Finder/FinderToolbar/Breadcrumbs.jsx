import React from 'react'
import { FaChevronRight } from 'react-icons/fa'

export default function Breadcrumbs({ items = [], onNavigate }) {
  const breadcrumbItems = Array.isArray(items)
    ? items
    : Array.isArray(items?.segments)
      ? items.segments
      : items
        ? [items]
        : [];

  if (breadcrumbItems.length === 0) {
    return (
      <nav aria-label="Breadcrumb" className="min-w-0" style={{ color: 'var(--text-secondary)' }}>
        <span className="rounded-lg px-2 py-1 text-[13px] font-medium opacity-70">Home</span>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="min-w-0" style={{ color: 'var(--text-secondary)' }}>
      <ol className="flex min-w-0 max-w-full items-center overflow-hidden whitespace-nowrap">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          return (
            <li key={item.id} className="flex items-center min-w-0">
              {isLast ? (
                <span className="truncate rounded-lg px-2 py-1 text-[13px] font-semibold text-[color:var(--text)]">{item.label ?? item.name ?? String(item.id ?? '')}</span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate?.(item.id)}
                  className="truncate rounded-lg px-2 py-1 text-[13px] font-medium transition-all duration-180 hover:bg-white/10 hover:text-[color:var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/30"
                >
                  {item.label ?? item.name ?? String(item.id ?? '')}
                </button>
              )}
              {!isLast && (
                <FaChevronRight
                  className="mx-1.5 shrink-0 text-[9px] opacity-40"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
