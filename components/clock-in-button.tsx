import {ClockIcon} from '@radix-ui/react-icons'
import {clsx} from 'clsx'
import * as React from 'react'
import {useEffect, useRef} from 'react'

import {useSelectedTag} from '@/app/selected-tag-provider'
import {useUserId} from '@/app/user-id-provider'
import {ToastAction} from '@/components/ui/toast'
import {useToast} from '@/components/ui/use-toast'
import {useClockedTime} from '@/hooks/useClockedTime'

export default function ClockInButton() {
  const {userId} = useUserId()
  const {selectedTag} = useSelectedTag()
  const {data, clockIn, clockOut, lastClockedTime, undo} = useClockedTime()
  const isClockedIn = lastClockedTime && !lastClockedTime.end
  const {toast} = useToast()

  const isClockedInRef = useRef(isClockedIn)
  const dataRef = useRef(data)

  useEffect(() => {
    isClockedInRef.current = isClockedIn
    dataRef.current = data
  }, [isClockedIn, data])

  const toggleClockIn = async () => {
    if (!isClockedIn && userId) {
      toast({
        description: 'Clocked in!',
        action: (
          <ToastAction
            altText="Undo"
            onClick={() => {
              const currentIsClockedIn = isClockedInRef.current
              const currentData = dataRef.current

              if (currentIsClockedIn) {
                undo({
                  ...currentData,
                  deleted: true,
                  lastClockedTime,
                })
              }
            }}
          >
            Undo
          </ToastAction>
        ),
      })

      clockIn({
        start: new Date(),
        userId,
        ...(selectedTag && {tagId: selectedTag.id}),
      })
    }

    if (isClockedIn && lastClockedTime) {
      clockOut({end: new Date(), id: lastClockedTime.id})
    }
  }

  return (
    <button onClick={() => toggleClockIn()}>
      <ClockIcon
        className={clsx(
          isClockedIn ? 'animate-pulse text-blue-600' : 'text-green-600',
          'h-72 w-72 ',
        )}
      />
    </button>
  )
}
