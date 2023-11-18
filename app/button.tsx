'use client'

import {clsx} from 'clsx'
import {useCount} from '@/app/useCount'
import {useIsClient} from 'usehooks-ts'

export default function Button() {
  const {hours, isClockedIn, minutes, seconds, toggleCounter} = useCount()
  const isClient = useIsClient()

  if (!isClient) {
    return null
  }

  return (
    <button
      onClick={toggleCounter}
      className={clsx(
        isClockedIn && 'bg-fuchsia-600',
        !isClockedIn && 'bg-emerald-700',
        'bg-emerald-700 w-full h-full rounded-full',
      )}
    >
      {hours}h {minutes}m {seconds}s
    </button>
  )
}
