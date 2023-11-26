import {type ClassValue, clsx} from 'clsx'
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isSameDay,
} from 'date-fns'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clockOutDescription(start: Date, end: Date) {
  const isDaySame = isSameDay(start, end)
  const startTime = format(start, 'h:mm a')
  const endTime = format(end, 'h:mm a')
  const startDay = format(start, 'MMM d, yyyy')
  const endDay = format(end, 'MMM d, yyyy')

  return isDaySame
    ? `${startDay} from ${startTime} to ${endTime}`
    : `${startDay} at ${startTime} to ${endDay} at ${endTime}`
}

export function getDuration(start: Date, end: Date) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const hours = differenceInHours(endDate, startDate)
  const minutes = differenceInMinutes(endDate, startDate) % 60
  const seconds = differenceInSeconds(endDate, startDate) % 60

  let duration = `${seconds} s`

  if (minutes) {
    duration = `${minutes} m `
  }

  if (hours) {
    duration = `${hours} h ` + duration
  }

  return duration
}
