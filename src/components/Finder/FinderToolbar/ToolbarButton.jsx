import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const sizeClasses = {
  md: 'h-9 w-9',
  sm: 'h-8 w-8',
};

const ToolbarButton = forwardRef(function ToolbarButton({
  icon,
  children,
  active = false,
  disabled = false,
  size = 'md',
  className = '',
  ...props
}, ref) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-xl border border-transparent select-none transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/30';
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const activeClasses = active
    ? 'shadow-sm'
    : 'hover:bg-white/10 hover:border-white/10 active:scale-95 active:bg-black/10 dark:hover:bg-white/5';

  return (
    <motion.button
      ref={ref}
      layout="position"
      type="button"
      className={`${baseClasses} ${sizeClass} ${disabledClasses} ${activeClasses} ${className} group`}
      disabled={disabled}
      style={{
        color: 'var(--text-secondary)',
        WebkitTapHighlightColor: 'transparent',
      }}
      {...props}
    >
      <span className="flex items-center justify-center transition-transform duration-150 group-active:scale-90">
        {icon || children}
      </span>
    </motion.button>
  );
});

export default ToolbarButton;
