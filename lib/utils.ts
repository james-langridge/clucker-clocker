import {type ClassValue, clsx} from 'clsx'
import {format, isSameDay} from 'date-fns'
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
