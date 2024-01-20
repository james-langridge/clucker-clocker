// import dynamic from 'next/dynamic'
import * as React from 'react'

import AddTagDialog from '@/components/add-tag-dialog'
import TagPopover from '@/components/tag-popover'

// const TagPopover = dynamic(() => import('@/components/tag-popover'))
// const AddTagDialog = dynamic(() => import('@/components/add-tag-dialog'))

export default function TagToolbar() {
  return (
    <div className="flex space-x-2">
      <TagPopover />
      <AddTagDialog />
    </div>
  )
}
