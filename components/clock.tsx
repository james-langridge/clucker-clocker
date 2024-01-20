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
    return <SignInDialog />
  }

  return <ClockInButton userId={userId} selectedTag={selectedTag} />
}
