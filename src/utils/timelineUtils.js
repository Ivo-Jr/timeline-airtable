import { getDaysDifference } from './dateUtils.js';
import { TIMELINE_CONFIG } from './constants.js';

/**
 * Calculates the basic metrics of the timeline
 * @param {Array} items - Array of items in the timeline
 * @returns {Object} Metrics of the timeline
 */
export function calculateTimelineMetrics(items) {
  const dates = items.flatMap(item => [new Date(item.start), new Date(item.end)]);
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const totalDays = getDaysDifference(minDate, maxDate) + 1;
  
  return { minDate, maxDate, totalDays };
}

/**
 * Calculates the position of an item in the timeline
 * @param {Object} item - Item in the timeline
 * @param {Date} minDate - Minimum date in the timeline
 * @param {number} totalDays - Total days in the timeline
 * @returns {Object} Position and width of the item
 */
export function getItemPosition(item, minDate, totalDays) {
  const startDate = new Date(item.start);
  const endDate = new Date(item.end);
  
  const startDays = Math.floor(getDaysDifference(minDate, startDate));
  const duration = getDaysDifference(startDate, endDate) + 1;
  
  const left = (startDays / totalDays) * 100;
  const width = Math.max((duration / totalDays) * 100, TIMELINE_CONFIG.MIN_ITEM_WIDTH_PERCENT);
  
  return { left, width };
}

/**
 * Calculates the interval of the timeline
 * @param {number} totalDays - Total days in the timeline
 * @returns {number} Interval in days
 */
export function calculateScaleInterval(totalDays) {
  return Math.max(TIMELINE_CONFIG.SCALE_INTERVAL_DAYS, Math.floor(totalDays / 10));
}

/**
 * Generates markers for the timeline
 * @param {Date} minDate - Minimum date in the timeline
 * @param {number} totalDays - Total days in the timeline
 * @param {number} interval - Interval between markers
 * @returns {Array} Array of markers
 */
export function generateScaleMarkers(minDate, totalDays, interval) {
  const markers = [];
  
  for (let i = 0; i <= totalDays; i += interval) {
    const date = new Date(minDate.getTime() + i * 24 * 60 * 60 * 1000);
    const left = (i / totalDays) * 100;
    
    markers.push({
      key: i,
      date,
      left,
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return markers;
}

/**
 * Converts a percentage position to a date
 * @param {number} percentage - Position percentage (0-100)
 * @param {Date} minDate - Minimum date in the timeline
 * @param {number} totalDays - Total days in the timeline
 * @returns {Date} Corresponding date
 */
export function percentageToDate(percentage, minDate, totalDays) {
  const days = Math.round((percentage / 100) * totalDays);
  const date = new Date(minDate);
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Converts a date to percentage position
 * @param {Date} date - Date to convert
 * @param {Date} minDate - Minimum date in the timeline
 * @param {number} totalDays - Total days in the timeline
 * @returns {number} Position percentage (0-100)
 */
export function dateToPercentage(date, minDate, totalDays) {
  const days = getDaysDifference(minDate, date);
  return (days / totalDays) * 100;
}

/**
 * Formats a date to YYYY-MM-DD string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDateString(date) {
  return date.toISOString().split('T')[0];
}
