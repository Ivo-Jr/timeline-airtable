import React from 'react';
import { formatDate } from '../../utils/dateUtils.js';
import { STYLES } from '../../utils/constants.js';

export default function TimelineStats({ lanes, items, minDate, maxDate }) {
  return (
    <div style={{
      marginTop: '16px',
      padding: '12px',
      backgroundColor: STYLES.BACKGROUND_COLOR,
      borderRadius: '6px',
      fontSize: '14px',
      color: STYLES.TEXT_COLOR,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center'
    }}>
      <div>
        <strong style={{ color: '#1F2937' }}>{lanes.length}</strong> organized lanes
      </div>
      <div>
        <strong style={{ color: '#1F2937' }}>{items.length}</strong> items
      </div>
      <div>
        Period: <strong style={{ color: '#1F2937' }}>
          {formatDate(minDate.toISOString().split('T')[0])}
        </strong> to <strong style={{ color: '#1F2937' }}>
          {formatDate(maxDate.toISOString().split('T')[0])}
        </strong>
      </div>
      <div style={{ 
        fontSize: '12px', 
        color: '#9CA3AF',
        fontStyle: 'italic',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div>💡 Double-click on items to edit them</div>
        <div>🖱️ Drag the edges to resize, the middle to move</div>
      </div>
    </div>
  );
}
