import React from 'react';
import TimelineItem from './TimelineItem.js';
import { TIMELINE_CONFIG, STYLES } from '../../utils/constants.js';

export default function Lane({ items, laneIndex, minDate, totalDays, isLastLane }) {
  return (
    <div 
      style={{
        position: 'relative',
        height: `${TIMELINE_CONFIG.LANE_HEIGHT}px`,
        marginBottom: `${TIMELINE_CONFIG.LANE_MARGIN}px`,
        borderBottom: !isLastLane ? `1px solid ${STYLES.BORDER_COLOR}` : 'none'
      }}
    >
      {items.map(item => (
        <TimelineItem 
          key={item.id}
          item={item}
          minDate={minDate}
          totalDays={totalDays}
          laneIndex={laneIndex}
        />
      ))}
    </div>
  );
}
