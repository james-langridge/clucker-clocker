'use client'

import {clsx} from 'clsx'
import {useCount} from '@/hooks/useCount'
import {useIsClient} from 'usehooks-ts'

export default function ClockInButton({userId}: {userId?: string}) {
  const {hours, isClockedIn, minutes, seconds, start, toggleCounter} =
    useCount()
  const isClient = useIsClient()

  if (!isClient) {
    return null
  }

  const onClick = async () => {
    toggleCounter()

    if (isClockedIn && userId) {
      const end = new Date().toISOString()

      const body = JSON.stringify({start, end, userId})

      try {
        const response = await fetch('/api/clocked-times', {
          method: 'POST',
          body,
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        console.log(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  return (
    <div className="flex flex-col justify-between items-center h-full w-full">
      <div className="grow flex flex-col justify-center items-center h-full w-full">
        <button
          onClick={() => onClick()}
          className={clsx(
            isClockedIn ? 'bg-fuchsia-600' : 'bg-emerald-700',
            'rounded-full w-full max-w-xs h-80',
          )}
        >
          {hours}h {minutes}m {seconds}s
        </button>
      </div>
    </div>
  )
}
