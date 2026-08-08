import React, { useLayoutEffect, useRef, useState } from 'react'
import { FaGripHorizontal, FaList } from 'react-icons/fa'
import { motion } from 'framer-motion'
import ToolbarButton from './ToolbarButton'

export default function ViewSegment({ viewMode, onViewModeChange }) {
  const containerRef = useRef(null)
  const gridRef = useRef(null)
  const listRef = useRef(null)
  const [indicator, setIndicator] = useState({ x: 0, width: 34 })

  useLayoutEffect(() => {
    const container = containerRef.current
    const active = viewMode === 'grid' ? gridRef.current : listRef.current
    if (!container || !active) return

    const c = container.getBoundingClientRect()
    const a = active.getBoundingClientRect()

    setIndicator({
      x: a.left - c.left,
      width: a.width,
    })
  }, [viewMode])

  return (
    <div
      className="inline-flex h-9 items-center overflow-hidden rounded-2xl border p-1"
      style={{
        background: 'color-mix(in srgb, var(--window) 60%, transparent)',
        borderColor: 'color-mix(in srgb, var(--border) 45%, transparent)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,.08), inset 0 -1px 0 rgba(0,0,0,.05)',
      }}
    >
      <div ref={containerRef} className="relative flex items-center divide-x divide-white/10 dark:divide-white/5">
        <motion.div
          layoutId="finder-view-indicator"
          transition={{
            type: 'spring',
            stiffness: 520,
            damping: 38,
            mass: 0.65,
          }}
          className="absolute top-0.5 bottom-0.5 rounded-xl"
          animate={indicator}
          style={{
            background: 'color-mix(in srgb, var(--accent) 18%, white 12%)',
            boxShadow: '0 1px 6px rgba(0,0,0,.12)',
            pointerEvents: 'none',
          }}
        />
        <ToolbarButton
          ref={gridRef}
          className="relative overflow-hidden z-10 mx-0.5"
          active={viewMode === 'grid'}
          onClick={() => onViewModeChange?.('grid')}
          aria-label="Grid view"
          aria-pressed={viewMode === 'grid'}
        >
          <span className="relative z-10">
            <FaGripHorizontal />
          </span>
        </ToolbarButton>
        <ToolbarButton
          ref={listRef}
          className="relative overflow-hidden z-10 mx-0.5"
          active={viewMode === 'list'}
          onClick={() => onViewModeChange?.('list')}
          aria-label="List view"
          aria-pressed={viewMode === 'list'}
        >
          <span className="relative z-10">
            <FaList />
          </span>
        </ToolbarButton>
      </div>
    </div>
  )
}
