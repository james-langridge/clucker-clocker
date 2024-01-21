import * as React from 'react'

import {useCount} from '@/hooks/useCount'

export default function Counter() {
  const {hours, minutes, seconds, isClockedIn} = useCount()

  let count = `${seconds} s`

  if (minutes) {
    count = `${minutes} m ${seconds} s`
  }

  if (hours) {
    count = `${hours} h ${minutes} m ${seconds} s`
  }

  return <div className="text-3xl h-9">{isClockedIn && count}</div>
}
