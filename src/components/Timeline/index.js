import React, { useState } from 'react';
import assignLanes from '../../utils/assignLanes.js';
import { calculateTimelineMetrics } from '../../utils/timelineUtils.js';
import TimeScale from './TimeScale.js';
import Lane from './Lane.js';
import TimelineStats from './TimelineStats.js';
import { STYLES } from '../../utils/constants.js';

export default function Timeline({ items: initialItems }) {
  const [items, setItems] = useState(initialItems);
  
  const handleUpdateItem = (itemId, updatedItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? updatedItem : item
      )
    );
  };

  const lanes = assignLanes(items);
  const { minDate, maxDate, totalDays } = calculateTimelineMetrics(items);
  
  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        border: `1px solid ${STYLES.BORDER_COLOR}`,
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <TimeScale 
          minDate={minDate} 
          maxDate={maxDate} 
          totalDays={totalDays} 
        />
        
        <div style={{ position: 'relative' }}>
          {lanes.map((lane, laneIndex) => (
            <Lane
              key={laneIndex}
              items={lane}
              laneIndex={laneIndex}
              minDate={minDate}
              totalDays={totalDays}
              isLastLane={laneIndex === lanes.length - 1}
              onUpdateItem={handleUpdateItem}
            />
          ))}
        </div>
        
        <TimelineStats 
          lanes={lanes}
          items={items}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    </div>
  );
}
