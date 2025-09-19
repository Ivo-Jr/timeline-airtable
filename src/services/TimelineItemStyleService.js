import { LANE_COLORS, TIMELINE_CONFIG } from '../utils/constants.js';

export class TimelineItemStyleService {
  static getItemColor(laneIndex) {
    return LANE_COLORS[laneIndex % LANE_COLORS.length];
  }

  static getBaseStyle(left, width, color, isEditing, isDragging) {
    return {
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
      boxShadow: this.getBoxShadow(isEditing, isDragging),
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      border: isEditing ? '2px solid rgba(255,255,255,0.5)' : 'none',
      transform: isEditing ? 'translateY(-2px)' : 'translateY(0)',
      opacity: isDragging ? 0.8 : 1,
      zIndex: isDragging ? 1000 : 1
    };
  }

  static getBoxShadow(isEditing, isDragging) {
    if (isEditing) return '0 4px 12px rgba(0,0,0,0.2)';
    if (isDragging) return '0 4px 8px rgba(0,0,0,0.15)';
    return '0 2px 4px rgba(0,0,0,0.1)';
  }

  static getTooltipText(item, formatDate, isEditing, isDragging) {
    if (isEditing) return 'Press Enter to save, Esc to cancel';
    if (isDragging) return 'Dragging...';
    
    return `${item.name}\n${formatDate(item.start)} - ${formatDate(item.end)}\nDouble click to edit\nDrag to move or resize`;
  }

  static applyHoverEffect(element) {
    if (element) {
      element.style.transform = 'translateY(-2px)';
      element.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }
  }

  static removeHoverEffect(element) {
    if (element) {
      element.style.transform = 'translateY(0)';
      element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
  }
}
