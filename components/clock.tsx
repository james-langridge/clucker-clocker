import {Tag} from '@prisma/client'
import * as React from 'react'
import {useIsClient} from 'usehooks-ts'

import ClockInButton from '@/components/clock-in-button'
import SignInDialog from '@/components/sign-in-dialog'

export default function Clock({
  userId,
  selectedTag,
}: {
  userId?: string
  selectedTag: Tag | null
}) {
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

  return <ClockInButton userId={userId} selectedTag={selectedTag} />
}
