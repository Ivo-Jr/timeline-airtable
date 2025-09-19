import React, { useState, useRef, useEffect } from 'react';
import { getItemPosition, percentageToDate, formatDateString } from '../../utils/timelineUtils.js';
import { formatDate } from '../../utils/dateUtils.js';
import { LANE_COLORS, TIMELINE_CONFIG } from '../../utils/constants.js';

export default function TimelineItem({ item, minDate, totalDays, laneIndex, onUpdateItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(item.name);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, left: 0, width: 0 });
  const inputRef = useRef(null);
  const itemRef = useRef(null);
  
  const { left, width } = getItemPosition(item, minDate, totalDays);
  const color = LANE_COLORS[laneIndex % LANE_COLORS.length];
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !itemRef.current) return;

      const parentRect = itemRef.current.parentElement.getBoundingClientRect();
      const deltaX = e.clientX - dragStart.x;
      const deltaPercentage = (deltaX / parentRect.width) * 100;

      let newLeft = dragStart.left;
      let newWidth = dragStart.width;

      if (dragType === 'move') {
        newLeft = Math.max(0, Math.min(100 - dragStart.width, dragStart.left + deltaPercentage));
      } else if (dragType === 'start') {
        const maxDelta = dragStart.width - TIMELINE_CONFIG.MIN_ITEM_WIDTH_PERCENT;
        const clampedDelta = Math.max(-dragStart.left, Math.min(maxDelta, deltaPercentage));
        newLeft = dragStart.left + clampedDelta;
        newWidth = dragStart.width - clampedDelta;
      } else if (dragType === 'end') {
        const maxWidth = 100 - dragStart.left;
        const minWidth = TIMELINE_CONFIG.MIN_ITEM_WIDTH_PERCENT;
        newWidth = Math.max(minWidth, Math.min(maxWidth, dragStart.width + deltaPercentage));
      }

      if (itemRef.current) {
        itemRef.current.style.left = `${newLeft}%`;
        itemRef.current.style.width = `${newWidth}%`;
      }
    };

    const handleMouseUp = () => {
      if (!isDragging || !itemRef.current) return;

      const currentLeft = parseFloat(itemRef.current.style.left);
      const currentWidth = parseFloat(itemRef.current.style.width);

      const newStartDate = percentageToDate(currentLeft, minDate, totalDays);
      const newEndDate = percentageToDate(currentLeft + currentWidth, minDate, totalDays);

      if (newEndDate <= newStartDate) {
        newEndDate.setDate(newStartDate.getDate() + TIMELINE_CONFIG.MIN_DURATION_DAYS);
      }

      const updatedItem = {
        ...item,
        start: formatDateString(newStartDate),
        end: formatDateString(newEndDate)
      };

      onUpdateItem(item.id, updatedItem);
      
      setIsDragging(false);
      setDragType(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = dragType === 'move' ? 'grabbing' : 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragStart, dragType, item, minDate, totalDays, onUpdateItem]);

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
    if (!isEditing && !isDragging) {
      setIsEditing(true);
      setEditingName(item.name);
    }
  };

  const handleMouseDown = (e, type) => {
    if (isEditing) return;
    
    e.preventDefault();
    e.stopPropagation();

    setDragStart({
      x: e.clientX,
      left: left,
      width: width
    });
    setDragType(type);
    setIsDragging(true);
  };

  const getStartHandleStyle = () => ({
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100%',
    width: `${TIMELINE_CONFIG.DRAG_HANDLE_WIDTH}px`,
    cursor: 'col-resize',
    zIndex: 10,
    backgroundColor: 'transparent',
    pointerEvents: isDragging ? 'none' : 'auto'
  });

  const getEndHandleStyle = () => ({
    position: 'absolute',
    top: '0',
    right: '0',
    height: '100%',
    width: `${TIMELINE_CONFIG.DRAG_HANDLE_WIDTH}px`,
    cursor: 'col-resize',
    zIndex: 10,
    backgroundColor: 'transparent',
    pointerEvents: isDragging ? 'none' : 'auto'
  });

  const getMoveHandleStyle = () => ({
    position: 'absolute',
    top: '0',
    left: `${TIMELINE_CONFIG.DRAG_HANDLE_WIDTH}px`,
    right: `${TIMELINE_CONFIG.DRAG_HANDLE_WIDTH}px`,
    height: '100%',
    cursor: isDragging && dragType === 'move' ? 'grabbing' : 'grab',
    zIndex: 5,
    backgroundColor: 'transparent',
    pointerEvents: isDragging ? 'none' : 'auto'
  });

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
      ref={itemRef}
      style={{
        ...baseStyle,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1000 : 1
      }} 
      title={
        isEditing ? 'Press Enter to save, Esc to cancel' : 
        isDragging ? 'Dragging...' :
        `${item.name}\n${formatDate(item.start)} - ${formatDate(item.end)}\nDouble click to edit\nDrag to move or resize`
      }
      onDoubleClick={handleDoubleClick}
      onMouseEnter={!isDragging ? handleMouseEnter : undefined}
      onMouseLeave={!isDragging ? handleMouseLeave : undefined}
    >
        {!isEditing && (
          <div
            style={getStartHandleStyle()}
            onMouseDown={(e) => handleMouseDown(e, 'start')}
          />
        )}

        {!isEditing && (
          <div
            style={getMoveHandleStyle()}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
          />
        )}

        {!isEditing && (
          <div
            style={getEndHandleStyle()}
            onMouseDown={(e) => handleMouseDown(e, 'end')}
          />
        )}

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
            outline: 'none',
            zIndex: 15
          }}
          maxLength={50}
        />
      ) : (
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
          {item.name}
        </span>
      )}
    </div>
  );
}
