import {ClockIcon} from '@radix-ui/react-icons'
import {clsx} from 'clsx'
import * as React from 'react'

import {useClockInButton} from '@/hooks/useClockInButton'

export default function ClockInButton() {
  const {isClockedIn, toggleClockIn} = useClockInButton()

  return (
    <button onClick={() => toggleClockIn()}>
      <ClockIcon
        className={clsx(
          isClockedIn ? 'animate-spin-slow text-blue-600' : 'text-green-600',
          'h-72 w-72 ',
        )}
      />
    </button>
  )
}
