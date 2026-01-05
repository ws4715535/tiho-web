import { type ClassValue, clsx } from "clsx";
import { twMerge } from 'tailwind-merge';
import { getSeasonRule } from '../constants/season';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to format date as YYYY-MM-DD using local time
function toLocalDateString(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * 计算指定月份包含的比赛周数量
 */
export function getWeeksInMonth(year: number, month: number): number {
  const rule = getSeasonRule(year);
  const weeks: Date[] = [];
  
  // Start from the 1st day of the month
  let d = new Date(year, month - 1, 1);
  
  // Loop through the whole month
  while (d.getMonth() === month - 1) {
    // Check if current day is settlement day (e.g., Thu for 2025, Sun for 2026)
    if (d.getDay() === rule.settlementDay) {
        // Check if this date is excluded
        const dateStr = toLocalDateString(d);
        if (!rule.excludedSettlementDates?.includes(dateStr)) {
            weeks.push(new Date(d));
        }
    }
    d.setDate(d.getDate() + 1);
  }

  // Special check for 2025-12 (to include the 5th week manually if not detected by standard logic)
  if (year === 2025 && month === 12 && weeks.length === 4) {
      // Add a dummy date for 5th week, the actual date range logic is handled in calculateWeekRange
      weeks.push(new Date(2025, 11, 31)); 
  }
  
  return weeks.length;
}

export function calculateWeekRange(year: number, month: number, week: number): { startDate: Date, endDate: Date } {
  const rule = getSeasonRule(year);

  // Check for special week configuration
  const specialKey = `${year}-${month}-${week}`;
  if (rule.specialWeeks && rule.specialWeeks[specialKey]) {
      const config = rule.specialWeeks[specialKey];
      const startDate = new Date(config.startDate);
      const endDate = new Date(config.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      return { startDate, endDate };
  }

  // Standard Logic
  const firstDay = new Date(year, month - 1, 1);
  let firstSettlementDay = new Date(firstDay);
  
  // Find the first settlement day of the month
  while (firstSettlementDay.getDay() !== rule.settlementDay) {
    firstSettlementDay.setDate(firstSettlementDay.getDate() + 1);
  }

  // Let's iterate to find the Nth valid settlement day
  let currentSettlementDay = new Date(year, month - 1, 1);
  while (currentSettlementDay.getDay() !== rule.settlementDay) {
      currentSettlementDay.setDate(currentSettlementDay.getDate() + 1);
  }

  // Now currentSettlementDay is the first calendar settlement day.
  // We need to loop until we find the 'week'-th valid settlement day.
  
  let validWeeksCount = 0;
  while (validWeeksCount < week) {
      const dateStr = toLocalDateString(currentSettlementDay);
      if (!rule.excludedSettlementDates?.includes(dateStr)) {
          validWeeksCount++;
      }
      
      if (validWeeksCount === week) {
          break;
      }
      
      // Move to next week
      currentSettlementDay.setDate(currentSettlementDay.getDate() + 7);
  }
  
  // Now currentSettlementDay is the End Date
  const endDate = new Date(currentSettlementDay);
  endDate.setHours(23, 59, 59, 999);
  
  // Calculate Start Date
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - rule.durationDays);
  // Set start date to beginning of day
  startDate.setHours(0, 0, 0, 0);

  return { startDate, endDate };
}

/**
 * 获取全月的日期范围
 * 规则：该月第1周的起始日 ~ 该月最后一周的结束日
 */
export function getMonthDateRange(year: number, month: number): { startDate: Date, endDate: Date } {
  const totalWeeks = getWeeksInMonth(year, month);
  if (totalWeeks === 0) {
    // Fallback if no Thursdays in month? (Impossible for a full month usually, except weird edge cases or February non-leap?)
    // Actually every month has at least 28 days, so at least 4 weeks usually.
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return { startDate: start, endDate: end };
  }

  const firstWeek = calculateWeekRange(year, month, 1);
  const lastWeek = calculateWeekRange(year, month, totalWeeks);

  return {
    startDate: firstWeek.startDate,
    endDate: lastWeek.endDate
  };
}

export function getWeekDateRange(year: number, month: number, week: number): string {
  const { startDate, endDate } = calculateWeekRange(year, month, week);
  
  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return `${y}/${m}/${dd}`;
  };
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function isWeekInProgress(year: number, month: number, week: number): boolean {
  const { startDate, endDate } = calculateWeekRange(year, month, week);
  const now = new Date();
  return now >= startDate && now <= endDate;
}