'use client'

import * as React from 'react'
import {useEffect} from 'react'

import SelectedTagProvider from '@/app/selected-tag-provider'
import {useUserId} from '@/app/user-id-provider'
import ClockInButton from '@/components/clock-in-button'
import Counter from '@/components/counter'
import SignInDialog from '@/components/sign-in-dialog'
import TagToolbar from '@/components/tag-toolbar'

export default function HomePage({userId}: {userId?: string}) {
  const {setUserId} = useUserId()

  // Save the userId from the server into context
  useEffect(() => {
    setUserId(userId)
  }, [setUserId, userId])

  return (
    <>
      <Counter />
      <SelectedTagProvider>
        {userId ? <ClockInButton /> : <SignInDialog />}
        <TagToolbar />
      </SelectedTagProvider>
    </>
  )
}
