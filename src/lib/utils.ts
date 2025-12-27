import { type ClassValue, clsx } from "clsx";
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 计算指定月份包含的比赛周数量
 * 规则：比赛周结束日期（周四）所在的月份决定该周归属的月份
 * 
 * 逻辑：
 * 1. 找到该月1号
 * 2. 如果1号是周五/周六/周日/周一/周二/周三/周四？
 *    比赛周定义：周五开始，下周四结束。
 *    归属判定：如果周四落在本月，则该周属于本月。
 * 
 * 反向推导：
 * 找到本月所有的周四。
 * 每一个在本月的周四，都对应一个属于本月的比赛周。
 * 
 * 例如：
 * 2025年12月
 * 1号是周一。
 * 第一个周四是 12月4日。这是本月第1个比赛周的结束日。
 * (起始日是 11月28日周五，但因为结束日12.4在本月，所以归属12月第1周)
 * 
 * 第二个周四 12月11日 -> 第2周
 * 第三个周四 12月18日 -> 第3周
 * 第四个周四 12月25日 -> 第4周
 * 
 * 下一个周四是 1月1日 -> 属于1月，不属于12月。
 * 
 * 所以本月有4个周。
 */
export function getWeeksInMonth(year: number, month: number): number {
  const weeks: Date[] = [];
  
  // Start from the 1st day of the month
  let d = new Date(year, month - 1, 1);
  
  // Loop through the whole month
  while (d.getMonth() === month - 1) {
    // If it's Thursday (4), it's a match week ending day for this month
    if (d.getDay() === 4) {
      weeks.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  
  return weeks.length;
}

export function calculateWeekRange(year: number, month: number, week: number): { startDate: Date, endDate: Date } {
  // Logic: Find the Nth Thursday of the month (which is the End Date)
  // Then subtract 6 days to get Start Date (Friday)
  
  const firstDay = new Date(year, month - 1, 1);
  let firstThursday = new Date(firstDay);
  
  // Find the first Thursday of the month
  // (This corresponds to Week 1's end date)
  while (firstThursday.getDay() !== 4) {
    firstThursday.setDate(firstThursday.getDate() + 1);
  }
  
  // Calculate Nth Thursday (End Date)
  const endDate = new Date(firstThursday);
  endDate.setDate(firstThursday.getDate() + (week - 1) * 7);
  // Set end date to end of day
  endDate.setHours(23, 59, 59, 999);
  
  // Calculate Start Date (6 days before End Date)
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 6);
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