'use client'

import * as React from 'react'
import {useIsClient} from 'usehooks-ts'

import ClockInButton from '@/components/clock-in-button'
import SignInDialog from '@/components/sign-in-dialog'
import TagDialog from '@/components/tag-dialog'
import {useClockedTime} from '@/hooks/useClockedTime'

export default function Clock({userId}: {userId?: string}) {
  const {lastClockedTime} = useClockedTime({userId})
  const isClockedIn = lastClockedTime && !lastClockedTime.end
  const isClient = useIsClient()

  if (!isClient) {
    return null
  }

  if (!userId) {
    return (
      <div className="flex flex-col justify-between items-center h-full w-full">
        <div className="grow flex flex-col justify-center items-center h-full w-full">
          <SignInDialog />
        </div>
      </div>
    )
  }

  if (isClockedIn && !lastClockedTime?.tagId) {
    return (
      <TagDialog userId={userId}>
        <ClockInButton userId={userId} />
      </TagDialog>
    )
  }

  if (isClockedIn && lastClockedTime?.tagId) {
    return <ClockInButton userId={userId} />
  }

  return (
    <TagDialog userId={userId}>
      <ClockInButton userId={userId} />
    </TagDialog>
  )
}
