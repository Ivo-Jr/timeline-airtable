import { useState, useEffect, useRef } from 'react';
import { percentageToDate, formatDateString } from '../utils/timelineUtils.js';
import { TIMELINE_CONFIG } from '../utils/constants.js';

export function useDragAndDrop(item, minDate, totalDays, onUpdateItem) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, left: 0, width: 0 });
  const elementRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !elementRef.current) return;

      const parentRect = elementRef.current.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

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

      // Update visual position during drag
      elementRef.current.style.left = `${newLeft}%`;
      elementRef.current.style.width = `${newWidth}%`;
    };

    const handleMouseUp = () => {
      if (!isDragging || !elementRef.current) return;

      const currentLeft = parseFloat(elementRef.current.style.left);
      const currentWidth = parseFloat(elementRef.current.style.width);
      
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

  const startDrag = (e, type, currentLeft, currentWidth) => {
    e.preventDefault();
    e.stopPropagation();

    setDragStart({
      x: e.clientX,
      left: currentLeft,
      width: currentWidth
    });
    setDragType(type);
    setIsDragging(true);
  };

  const setElementRef = (ref) => {
    elementRef.current = ref;
  };

  return {
    isDragging,
    dragType,
    startDrag,
    setElementRef
  };
}
