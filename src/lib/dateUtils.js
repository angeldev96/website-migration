import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Default timezone for the application (New York)
const DEFAULT_TIMEZONE = 'America/New_York';

/**
 * Parse a date string and return a dayjs object in NY timezone
 * Handles various date formats from the database:
 * - ISO string with timezone: "2025-11-26T07:18:34.726-05:00"
 * - Date only (from Prisma @db.Date): "2025-11-26T00:00:00.000Z"
 * - Date only: "2025-11-26"
 * - Date object from Prisma
 */
export function parseDate(dateValue) {
  if (!dateValue) return null;
  
  // If it's already a dayjs object, return it
  if (dayjs.isDayjs(dateValue)) return dateValue;
  
  // Handle native Date objects (from Prisma @db.Date fields)
  if (dateValue instanceof Date) {
    // For @db.Date fields, Prisma returns a Date object at midnight UTC
    // We need to extract the UTC date parts and treat them as the intended date
    const year = dateValue.getUTCFullYear();
    const month = String(dateValue.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getUTCDate()).padStart(2, '0');
    const datePart = `${year}-${month}-${day}`;
    return dayjs.tz(datePart, DEFAULT_TIMEZONE);
  }
  
  const dateStr = String(dateValue);
  
  // Check if it's a date-only format from Prisma (ends with T00:00:00.000Z)
  // This happens when Prisma serializes a @db.Date field to JSON
  // In this case, we want to treat it as a local date, not UTC
  if (dateStr.endsWith('T00:00:00.000Z') || dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Extract just the date part (YYYY-MM-DD)
    const datePart = dateStr.substring(0, 10);
    // Parse as local date in NY timezone (without UTC conversion)
    return dayjs.tz(datePart, DEFAULT_TIMEZONE);
  }
  
  // For full timestamps with time info, parse normally and convert to NY
  return dayjs(dateValue).tz(DEFAULT_TIMEZONE);
}

/**
 * Get today's date in NY timezone
 */
export function getTodayInNY() {
  return dayjs().tz(DEFAULT_TIMEZONE).startOf('day');
}

/**
 * Format a date for display with relative time (Today, Yesterday, X days ago)
 * @param {string|Date} dateValue - The date to format
 * @returns {string} Formatted date string
 */
export function formatRelativeDate(dateValue) {
  if (!dateValue) return 'Recently';
  
  const date = parseDate(dateValue);
  if (!date || !date.isValid()) return 'Recently';
  
  const today = getTodayInNY();
  const jobDate = date.startOf('day');
  
  const diffDays = today.diff(jobDate, 'day');
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  
  // For older dates, show the full date
  return date.format('MMM D, YYYY');
}

/**
 * Format a date for full display (e.g., "November 26, 2025")
 * @param {string|Date} dateValue - The date to format
 * @returns {string} Formatted date string
 */
export function formatFullDate(dateValue) {
  if (!dateValue) return 'Recently posted';
  
  const date = parseDate(dateValue);
  if (!date || !date.isValid()) return 'Recently posted';
  
  return date.format('MMMM D, YYYY');
}

/**
 * Format a date for short display (e.g., "Nov 26, 2025")
 * @param {string|Date} dateValue - The date to format
 * @returns {string} Formatted date string
 */
export function formatShortDate(dateValue) {
  if (!dateValue) return '';
  
  const date = parseDate(dateValue);
  if (!date || !date.isValid()) return '';
  
  return date.format('MMM D, YYYY');
}

/**
 * Get the ISO date string in NY timezone (YYYY-MM-DD)
 * Useful for comparing dates without time
 * @param {string|Date} dateValue - The date to format
 * @returns {string} Date in YYYY-MM-DD format
 */
export function getDateOnly(dateValue) {
  if (!dateValue) return null;
  
  const date = parseDate(dateValue);
  if (!date || !date.isValid()) return null;
  
  return date.format('YYYY-MM-DD');
}

export { dayjs, DEFAULT_TIMEZONE };
