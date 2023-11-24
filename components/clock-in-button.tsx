import {ClockIcon} from '@radix-ui/react-icons'
import {clsx} from 'clsx'
import * as React from 'react'

import {useClockedTime} from '@/hooks/useClockedTime'
import {useCount} from '@/hooks/useCount'

interface TheClockInButtonProps {
  userId: string
}

export const ClockInButton = React.forwardRef<
  HTMLDivElement,
  TheClockInButtonProps
>(({userId}, ref) => {
  const {lastClockedTime, isClockedIn, toggleCounter} = useCount(userId)
  const {clockInMutate, clockOutMutate} = useClockedTime({userId})

  const onClockInOut = async () => {
    toggleCounter()

    if (!isClockedIn && userId) {
      clockInMutate({start: new Date(), userId})
    }

    if (isClockedIn && lastClockedTime) {
      clockOutMutate({end: new Date(), id: lastClockedTime.id})
    }
  }

  return (
    <div
      ref={ref}
      className="flex flex-col justify-between items-center h-full w-full"
    >
      <div className="grow flex flex-col justify-center items-center h-full w-full">
        <button onClick={() => onClockInOut()}>
          <ClockIcon
            className={clsx(
              isClockedIn ? 'animate-pulse text-blue-600' : 'text-green-600',
              'h-72 w-72 ',
            )}
          />
        </button>
      </div>
    </div>
  )
})

ClockInButton.displayName = 'TheClockInButton'

export default ClockInButton
