import React from 'react';
import { TIMELINE_CONFIG } from '../../utils/constants.js';

function EditInput({ 
  inputRef, 
  value, 
  onChange, 
  onKeyDown, 
  onBlur, 
  maxLength = 50 
}) {
  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      style={{
        background: 'rgba(255,255,255,0.9)',
        color: '#1F2937',
        border: 'none',
        borderRadius: '2px',
        padding: '2px 4px',
        fontSize: '12px',
        fontWeight: '500',
        width: '100%',
        outline: 'none',
        zIndex: 15
      }}
      maxLength={maxLength}
    />
  );
}

function DisplayText({ children }) {
  return (
    <span style={{ 
      overflow: 'hidden', 
      textOverflow: 'ellipsis',
      fontWeight: '500',
      userSelect: 'none',
      pointerEvents: 'none',
      position: 'relative',
      zIndex: 1,
      display: 'block',
      width: '100%',
      padding: `0 ${TIMELINE_CONFIG.DRAG_HANDLE_WIDTH}px`
    }}>
      {children}
    </span>
  );
}

export default function EditableContent({ 
  isEditing, 
  value, 
  editProps,
  children 
}) {
  if (isEditing) {
    return <EditInput {...editProps} value={value} />;
  }

  return <DisplayText>{children}</DisplayText>;
}
