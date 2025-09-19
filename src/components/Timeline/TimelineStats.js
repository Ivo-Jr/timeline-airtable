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
        <strong style={{ color: '#1F2937' }}>{lanes.length}</strong> lanes organizadas
      </div>
      <div>
        <strong style={{ color: '#1F2937' }}>{items.length}</strong> itens
      </div>
      <div>
        Período: <strong style={{ color: '#1F2937' }}>
          {formatDate(minDate.toISOString().split('T')[0])}
        </strong> até <strong style={{ color: '#1F2937' }}>
          {formatDate(maxDate.toISOString().split('T')[0])}
        </strong>
      </div>
    </div>
  );
}
