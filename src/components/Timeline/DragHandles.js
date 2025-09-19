import React from 'react';
import { TIMELINE_CONFIG } from '../../utils/constants.js';

const createHandleStyle = (position, isDragging) => {
  const baseStyle = {
    position: 'absolute',
    top: '0',
    height: '100%',
    backgroundColor: 'transparent',
    pointerEvents: isDragging ? 'none' : 'auto'
  };

  const handleConfigs = {
    start: {
      left: '0',
      width: `${TIMELINE_CONFIG.DRAG_HANDLE_WIDTH}px`,
      cursor: 'col-resize',
      zIndex: 10
    },
    end: {
      right: '0',
      width: `${TIMELINE_CONFIG.DRAG_HANDLE_WIDTH}px`,
      cursor: 'col-resize',
      zIndex: 10
    },
    move: {
      left: `${TIMELINE_CONFIG.DRAG_HANDLE_WIDTH}px`,
      right: `${TIMELINE_CONFIG.DRAG_HANDLE_WIDTH}px`,
      cursor: 'grab',
      zIndex: 5
    }
  };

  return { ...baseStyle, ...handleConfigs[position] };
};

function DragHandle({ type, isDragging, onMouseDown }) {
  return (
    <div
      style={createHandleStyle(type, isDragging)}
      onMouseDown={onMouseDown}
    />
  );
}

export default function DragHandles({ isDragging, isEditing, onStartDrag }) {
  if (isEditing) return null;

  return (
    <>
      <DragHandle
        type="start"
        isDragging={isDragging}
        onMouseDown={(e) => onStartDrag(e, 'start')}
      />
      <DragHandle
        type="move"
        isDragging={isDragging}
        onMouseDown={(e) => onStartDrag(e, 'move')}
      />
      <DragHandle
        type="end"
        isDragging={isDragging}
        onMouseDown={(e) => onStartDrag(e, 'end')}
      />
    </>
  );
}
