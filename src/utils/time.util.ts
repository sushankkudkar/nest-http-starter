/**
 * Date and time utility functions.
 * @file Date and Time Utilities
 * @module utils/date-time
 * @description Provides utility functions for formatting and manipulating dates and times.
 */

import dayjs from 'dayjs'

/**
 * Gets the time in the format `HH:mm:ss`.
 * @param date - The date to format.
 * @returns The formatted time string.
 */
export const getShortTime = (date: Date): string => {
  return Intl.DateTimeFormat('en-US', {
    timeStyle: 'medium',
    hour12: false,
  }).format(date)
}

/**
 * Gets the date in the format `M-D-YY`.
 * @param date - The date to format.
 * @returns The formatted date string with slashes replaced by hyphens.
 */
export const getShortDate = (date: Date): string => {
  return Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
  })
    .format(date)
    .replaceAll('/', '-')
}

/**
 * Gets the date and time in the format `M-D-YY, HH:mm:ss`.
 * @param date - The date to format.
 * @returns The formatted date and time string with slashes replaced by hyphens.
 */
export const getShortDateTime = (date: Date): string => {
  return Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium',
    hour12: false,
  })
    .format(date)
    .replaceAll('/', '-')
}

/**
 * Gets the date and time in the format `YYYY-MM-DD_HH:mm:ss`.
 * @param date - The date to format.
 * @returns The formatted date and time string.
 */
export const getMediumDateTime = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD_HH:mm:ss')
}

/**
 * Gets the start of the day (00:00:00) for the given date.
 * @param today - The date to normalize.
 * @returns A new Date object set to the start of the day.
 */
export const getTodayEarly = (today: Date): Date =>
  dayjs(today).startOf('day').toDate()

/**
 * Gets the start of the week (Monday 00:00:00) for the given date.
 * @param today - The date to normalize.
 * @returns A new Date object set to the start of the week.
 */
export const getWeekStart = (today: Date): Date =>
  dayjs(today).startOf('week').toDate()

/**
 * Gets the start of the month (1st day, 00:00:00) for the given date.
 * @param today - The date to normalize.
 * @returns A new Date object set to the start of the month.
 */
export const getMonthStart = (today: Date): Date =>
  dayjs(today).startOf('month').toDate()

/**
 * Gets the number of days in a month.
 * @param month - The month (1-based index).
 * @param year - The year.
 * @returns The number of days in the specified month.
 */
export function getMonthLength(month: number, year: number): number {
  return new Date(year, month, 0).getDate()
}
