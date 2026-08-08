import React from 'react';
import { FaShareSquare, FaEllipsisH } from 'react-icons/fa';
import ToolbarButton from './ToolbarButton';

const ActionButtons = ({ compact = false, ultraCompact = false, onShare, onMore }) => {
  return (
    <div className="flex items-center gap-2">
      {!compact && (
        <ToolbarButton onClick={onShare} aria-label="Share">
          <FaShareSquare />
        </ToolbarButton>
      )}
      {!ultraCompact && (
        <ToolbarButton onClick={onMore} aria-label="More options">
          <FaEllipsisH />
        </ToolbarButton>
      )}
    </div>
  );
};

export default ActionButtons;
