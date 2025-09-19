import React from 'react';
import { getItemPosition } from '../../utils/timelineUtils.js';
import { formatDate } from '../../utils/dateUtils.js';
import { LANE_COLORS, TIMELINE_CONFIG } from '../../utils/constants.js';

export default function TimelineItem({ item, minDate, totalDays, laneIndex }) {
  const { left, width } = getItemPosition(item, minDate, totalDays);
  const color = LANE_COLORS[laneIndex % LANE_COLORS.length];
  
  const style = {
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
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  };

  const handleMouseEnter = (e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  };

  return (
    <div 
      style={style} 
      title={`${item.name}\n${formatDate(item.start)} - ${formatDate(item.end)}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span style={{ 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        fontWeight: '500'
      }}>
        {item.name}
      </span>
    </div>
  );
}
