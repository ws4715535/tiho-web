import { type ClassValue, clsx } from "clsx";
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateWeekRange(year: number, month: number, week: number): { startDate: Date, endDate: Date } {
  // Create date for the 1st day of the month
  // Note: Month in JS Date is 0-indexed (0=Jan, 11=Dec)
  const firstDay = new Date(year, month - 1, 1);
  
  // Find the first Thursday
  // Day of week: 0=Sun, 1=Mon, ..., 4=Thu, ...
  let firstThursday = new Date(firstDay);
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