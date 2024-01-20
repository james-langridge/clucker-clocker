import * as React from 'react'
import {useIsClient} from 'usehooks-ts'

import {useUserId} from '@/app/user-id-provider'
import ClockInButton from '@/components/clock-in-button'
import SignInDialog from '@/components/sign-in-dialog'

export default function Clock() {
  const {userId} = useUserId()
  const isClient = useIsClient()

  // TODO: remember why I needed this
  if (!isClient) {
    return null
  }

  if (!userId) {
    return <SignInDialog />
  }

  return <ClockInButton />
}
