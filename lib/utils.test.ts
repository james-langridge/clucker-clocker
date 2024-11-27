import {describe, expect, it} from 'vitest'

import {cn, clockOutDescription, getDuration} from './utils'

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
    expect(cn('foo', {bar: true, baz: false})).toBe('foo bar')
    expect(cn('foo', ['bar', 'baz'])).toBe('foo bar baz')
    // Test tailwind merge functionality
    expect(cn('px-2 py-1', 'px-3')).toBe('py-1 px-3')
  })
})

describe('clockOutDescription', () => {
  it('should format same-day time ranges correctly', () => {
    const start = new Date('2024-03-15T09:00:00')
    const end = new Date('2024-03-15T17:00:00')
    expect(clockOutDescription(start, end)).toBe(
      'Mar 15, 2024 from 9:00 AM to 5:00 PM',
    )
  })

  it('should format different-day time ranges correctly', () => {
    const start = new Date('2024-03-15T22:00:00')
    const end = new Date('2024-03-16T06:00:00')
    expect(clockOutDescription(start, end)).toBe(
      'Mar 15, 2024 at 10:00 PM to Mar 16, 2024 at 6:00 AM',
    )
  })
})

describe('getDuration', () => {
  it('should format duration with only seconds', () => {
    const start = new Date('2024-03-15T09:00:00')
    const end = new Date('2024-03-15T09:00:45')
    expect(getDuration(start, end)).toBe('45 s')
  })

  it('should format duration with minutes and seconds', () => {
    const start = new Date('2024-03-15T09:00:00')
    const end = new Date('2024-03-15T09:02:45')
    expect(getDuration(start, end)).toBe('2 m ')
  })

  it('should format duration with hours, minutes and seconds', () => {
    const start = new Date('2024-03-15T09:00:00')
    const end = new Date('2024-03-15T11:30:45')
    expect(getDuration(start, end)).toBe('2 h 30 m ')
  })

  it('should handle zero minutes case correctly', () => {
    const start = new Date('2024-03-15T09:00:00')
    const end = new Date('2024-03-15T11:00:45')
    expect(getDuration(start, end)).toBe('2 h 45 s')
  })
})
