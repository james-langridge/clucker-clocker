import dynamic from 'next/dynamic'
import * as React from 'react'
import {useEffect} from 'react'

import {useSelectedTag} from '@/app/selected-tag-provider'
import {Button} from '@/components/ui/button'
import {Popover, PopoverTrigger} from '@/components/ui/popover'
import {useLastClockedTime} from '@/hooks/useClockedTime'
import {useTag} from '@/hooks/useTag'

const PopoverContent = dynamic(
  () => import('../components/tag-popover-content'),
)

export default function TagPopover() {
  const [open, setOpen] = React.useState(false)
  const {setSelectedTag, selectedTag} = useSelectedTag()
  const {tags} = useTag()
  const {data: lastClockedTime} = useLastClockedTime()

  // Selected tag defaults to last used
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
          <PopoverContent
            tags={tags}
            setOpen={setOpen}
            lastClockedTime={lastClockedTime}
          />
        )}
      </Popover>
    </div>
  )
}
