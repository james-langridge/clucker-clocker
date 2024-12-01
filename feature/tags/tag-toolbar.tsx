import * as React from 'react'

import AddTagDialog from '@/feature/tags/add-tag-dialog'
import TagPopover from '@/feature/tags/tag-popover'

export default function TagToolbar() {
  return (
    <div className="flex space-x-2">
      <TagPopover />
      <AddTagDialog />
    </div>
  )
}
