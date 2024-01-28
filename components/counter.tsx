import * as React from 'react'

import {useCount} from '@/hooks/useCount'

export default function Counter() {
  const {hours, minutes, seconds, isClockedIn} = useCount()
  const count = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="text-2xl h-8 tabular-nums py-4">{isClockedIn && count}</div>
  )
}
