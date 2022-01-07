import { format } from 'date-fns';

const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
const DATE_FORMAT = 'yyyy-MM-dd ';
/**
 * convert YYYY-MM-DD HH:mm
 * @param date date
 * @param formatStr YYYY-MM-DD HH:mm
 * @returns YYYY-MM-DD HH:mm
 */
export function formatToDateTime(date: Date | number, formatStr = DATE_TIME_FORMAT): string {
  return format(date, formatStr);
}
/**
 * convert YYYY-MM-DD
 * @param date date
 * @param formatStr YYYY-MM-DD
 * @returns YYYY-MM-DD
 */
export function formatToDate(date: Date | number, formatStr = DATE_FORMAT): string {
  return format(date, formatStr);
}
