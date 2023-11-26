'use client'

import {Tag} from '@prisma/client'
import * as React from 'react'

import {AddTagDialog} from '@/components/add-tag-dialog'
import Clock from '@/components/clock'
import {TagPopover} from '@/components/tag-popover'

export default function HomePage({userId}: {userId?: string}) {
  const [selectedTag, setSelectedTag] = React.useState<Tag | null>(null)

  return (
    <>
      <Clock userId={userId} selectedTag={selectedTag} />
      <div className="flex space-x-2">
        <TagPopover
          userId={userId}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />{' '}
        <AddTagDialog userId={userId} />
      </div>
    </>
  )
}
