import React from 'react';
import Timeline from './components/Timeline/index.js';
import timelineItems from './data/timelineItems.js';

export default function App() {
  return (
    <div>
      <h2>Timeline Visualization ✨</h2>
      <h3>{timelineItems.length} timeline items</h3>
      <Timeline items={timelineItems} />
    </div>
  );
}
