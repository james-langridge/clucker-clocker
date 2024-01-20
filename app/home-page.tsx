'use client'

// import dynamic from 'next/dynamic'
import * as React from 'react'
import {useEffect} from 'react'

import SelectedTagProvider from '@/app/selected-tag-provider'
import {useUserId} from '@/app/user-id-provider'
import Clock from '@/components/clock'
import Counter from '@/components/counter'
import TagToolbar from '@/components/tag-toolbar'

// const TagToolbar = dynamic(() => import('@/components/tag-toolbar'))

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
        <Clock />
        <TagToolbar />
      </SelectedTagProvider>
    </>
  )
}
