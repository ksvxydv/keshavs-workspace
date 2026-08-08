import React from 'react';

const FinderToolbar = ({
  goBack,
  goForward,
  goHome,
  canGoBack,
  canGoForward,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '58px',
        padding: '0 12px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div data-region="navigation" style={{ flex: '0 0 auto' }}>
        {/* Navigation placeholder */}
      </div>
      <div
        data-region="breadcrumb"
        style={{
          flex: '1 1 auto',
          textAlign: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </div>
      <div data-region="actions" style={{ flex: '0 0 auto' }}>
        {/* Actions placeholder */}
      </div>
    </div>
  );
};

export default FinderToolbar;
