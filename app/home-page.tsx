'use client'

import * as React from 'react'

import SelectedTagProvider from '@/app/selected-tag-provider'
import SignInDialog from '@/feature/auth/sign-in-dialog'
import ClockInButton from '@/feature/clock/clock-in-button/clock-in-button'
import Counter from '@/feature/clock/counter/counter'
import PrevClockedTime from '@/feature/clock/prev-clocked-time'
import TagToolbar from '@/feature/tags/tag-toolbar'

export default function HomePage({userId}: {userId?: string}) {
  return (
    <>
      <PrevClockedTime />
      <Counter />
      <SelectedTagProvider>
        {userId ? <ClockInButton /> : <SignInDialog />}
        <TagToolbar />
      </SelectedTagProvider>
    </>
  )
}
