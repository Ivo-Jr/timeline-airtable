import React, { useState, useRef, useEffect } from 'react';
import { getItemPosition } from '../../utils/timelineUtils.js';
import { formatDate } from '../../utils/dateUtils.js';
import { LANE_COLORS, TIMELINE_CONFIG } from '../../utils/constants.js';

export default function TimelineItem({ item, minDate, totalDays, laneIndex, onUpdateItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(item.name);
  const inputRef = useRef(null);
  const { left, width } = getItemPosition(item, minDate, totalDays);
  const color = LANE_COLORS[laneIndex % LANE_COLORS.length];
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const baseStyle = {
    position: 'absolute',
    left: `${left}%`,
    width: `${width}%`,
    height: `${TIMELINE_CONFIG.ITEM_HEIGHT}px`,
    backgroundColor: color,
    borderRadius: TIMELINE_CONFIG.BORDER_RADIUS,
    padding: '4px 8px',
    color: 'white',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    cursor: isEditing ? 'text' : 'pointer',
    boxShadow: isEditing ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: isEditing ? '2px solid rgba(255,255,255,0.5)' : 'none',
    transform: isEditing ? 'translateY(-2px)' : 'translateY(0)'
  };

  const handleDoubleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      setEditingName(item.name);
    }
  };

  const handleSave = () => {
    if (editingName.trim() && editingName !== item.name) {
      onUpdateItem(item.id, { ...item, name: editingName.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingName(item.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleInputChange = (e) => {
    setEditingName(e.target.value);
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleMouseEnter = (e) => {
    if (!isEditing) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }
  };

  const handleMouseLeave = (e) => {
    if (!isEditing) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
  };

  return (
    <div 
      style={baseStyle} 
      title={isEditing ? 'Pressione Enter para salvar, Esc para cancelar' : `${item.name}\n${formatDate(item.start)} - ${formatDate(item.end)}\nDuplo clique para editar`}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editingName}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{
            background: 'rgba(255,255,255,0.9)',
            color: '#1F2937',
            border: 'none',
            borderRadius: '2px',
            padding: '2px 4px',
            fontSize: '12px',
            fontWeight: '500',
            width: '100%',
            outline: 'none'
          }}
          maxLength={50}
        />
      ) : (
        <span style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          fontWeight: '500',
          userSelect: 'none'
        }}>
          {item.name}
        </span>
      )}
    </div>
  );
}
