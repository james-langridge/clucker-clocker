'use client'

import {Tag} from '@prisma/client'
import dynamic from 'next/dynamic'
import * as React from 'react'

import Clock from '@/components/clock'
import Counter from '@/components/counter'

const DynamicTagPopover = dynamic(() => import('@/components/tag-popover'))
const DynamicAddTagDialog = dynamic(() => import('@/components/add-tag-dialog'))

export default function HomePage({userId}: {userId?: string}) {
  const [selectedTag, setSelectedTag] = React.useState<Tag | null>(null)

  return (
    <>
      <Counter userId={userId} />
      <Clock userId={userId} selectedTag={selectedTag} />
      <div className="flex space-x-2">
        <DynamicTagPopover
          userId={userId}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
        <DynamicAddTagDialog userId={userId} />
      </div>
    </>
  )
}
