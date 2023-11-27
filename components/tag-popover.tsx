import {Tag} from '@prisma/client'
import dynamic from 'next/dynamic'
import * as React from 'react'
import {Dispatch, SetStateAction, useEffect} from 'react'

import {Button} from '@/components/ui/button'
import {Popover, PopoverTrigger} from '@/components/ui/popover'
import {useClockedTime} from '@/hooks/useClockedTime'
import {useTag} from '@/hooks/useTag'

const DynamicPopoverContent = dynamic(
  () => import('../components/tag-popover-content'),
)

export default function TagPopover({
  userId,
  selectedTag,
  setSelectedTag,
}: {
  userId?: string
  selectedTag: Tag | null
  setSelectedTag: Dispatch<SetStateAction<Tag | null>>
}) {
  const [open, setOpen] = React.useState(false)

  const {tags} = useTag({userId})
  const {lastClockedTime} = useClockedTime({userId})

  useEffect(() => {
    setSelectedTag(tags?.find(tag => tag.id === lastClockedTime?.tagId) || null)
  }, [lastClockedTime?.tagId, setSelectedTag, tags])

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Tag</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[150px] justify-start"
          >
            {selectedTag ? <>{selectedTag.name}</> : <>Select</>}
          </Button>
        </PopoverTrigger>
        {open && (
          <DynamicPopoverContent
            tags={tags}
            setOpen={setOpen}
            setSelectedTag={setSelectedTag}
            lastClockedTime={lastClockedTime}
            userId={userId}
          />
        )}
      </Popover>
    </div>
  )
}
