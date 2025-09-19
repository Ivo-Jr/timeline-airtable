import React, { useRef } from 'react';
import { getItemPosition } from '../../utils/timelineUtils.js';
import { formatDate } from '../../utils/dateUtils.js';
import { useInlineEdit } from '../../hooks/useInlineEdit.js';
import { useDragAndDrop } from '../../hooks/useDragAndDrop.js';
import { TimelineItemStyleService } from '../../services/TimelineItemStyleService.js';
import DragHandles from './DragHandles.js';
import EditableContent from './EditableContent.js';

export default function TimelineItem({ item, minDate, totalDays, laneIndex, onUpdateItem }) {
  const itemRef = useRef(null);
  
  const { left, width } = getItemPosition(item, minDate, totalDays);
  const color = TimelineItemStyleService.getItemColor(laneIndex);
  
  const handleSaveEdit = (newName) => {
    onUpdateItem(item.id, { ...item, name: newName });
  };
  
  const {
    isEditing,
    editingValue,
    inputRef,
    startEditing,
    handleKeyDown,
    handleInputChange,
    handleBlur
  } = useInlineEdit(item.name, handleSaveEdit);
  
  const { isDragging, startDrag, setElementRef } = useDragAndDrop(item, minDate, totalDays, onUpdateItem);
  
  const handleDoubleClick = () => {
    if (!isEditing && !isDragging) {
      startEditing();
    }
  };

  const handleStartDrag = (e, type) => {
    if (isEditing) return;
    startDrag(e, type, left, width);
  };

  const handleMouseEnter = (e) => {
    if (!isEditing && !isDragging) {
      TimelineItemStyleService.applyHoverEffect(e.currentTarget);
    }
  };

  const handleMouseLeave = (e) => {
    if (!isEditing && !isDragging) {
      TimelineItemStyleService.removeHoverEffect(e.currentTarget);
    }
  };

  const baseStyle = TimelineItemStyleService.getBaseStyle(
    left, width, color, isEditing, isDragging
  );
  
  const tooltipText = TimelineItemStyleService.getTooltipText(
    item, formatDate, isEditing, isDragging
  );

  const editProps = {
    inputRef,
    onChange: handleInputChange,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur
  };

  return (
    <div 
      ref={(ref) => {
        itemRef.current = ref;
        setElementRef(ref);
      }}
      style={baseStyle}
      title={tooltipText}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DragHandles
        isDragging={isDragging}
        isEditing={isEditing}
        onStartDrag={handleStartDrag}
      />

      <EditableContent
        isEditing={isEditing}
        value={editingValue}
        editProps={editProps}
      >
        {item.name}
      </EditableContent>
    </div>
  );
}
