import React from 'react';
import { calculateScaleInterval, generateScaleMarkers } from '../../utils/timelineUtils.js';
import { STYLES } from '../../utils/constants.js';

export default function TimeScale({ minDate, maxDate, totalDays }) {
  const interval = calculateScaleInterval(totalDays);
  const markers = generateScaleMarkers(minDate, totalDays, interval);
  
  return (
    <div style={{
      position: 'relative',
      height: '30px',
      borderBottom: `2px solid ${STYLES.BORDER_COLOR}`,
      marginBottom: '10px',
      backgroundColor: STYLES.BACKGROUND_COLOR
    }}>
      {markers.map(marker => (
        <div 
          key={marker.key}
          style={{
            position: 'absolute',
            left: `${marker.left}%`,
            top: '0',
            height: '100%',
            borderLeft: `1px solid ${STYLES.BORDER_COLOR}`,
            paddingLeft: '4px',
            fontSize: '11px',
            color: STYLES.TEXT_COLOR,
            display: 'flex',
            alignItems: 'center',
            fontWeight: '500'
          }}
        >
          {marker.label}
        </div>
      ))}
    </div>
  );
}
