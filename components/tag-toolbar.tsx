import * as React from 'react'

import AddTagDialog from '@/components/add-tag-dialog'
import TagPopover from '@/components/tag-popover'

export default function TagToolbar() {
  return (
    <div className="flex space-x-2">
      <TagPopover />
      <AddTagDialog />
    </div>
  )
}
