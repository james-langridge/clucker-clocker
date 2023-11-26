import {Tag} from '@prisma/client'
import * as React from 'react'
import {Dispatch, SetStateAction, useEffect} from 'react'

import {Button} from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {useClockedTime} from '@/hooks/useClockedTime'
import {useTag} from '@/hooks/useTag'

export function TagPopover({
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
  const {lastClockedTime, mutateClockedTime} = useClockedTime({userId})
  const isClockedIn = lastClockedTime && !lastClockedTime.end

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
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setSelectedTag(null)
                    setOpen(false)

                    if (isClockedIn) {
                      mutateClockedTime({
                        id: lastClockedTime.id,
                        tagId: null,
                      })
                    }
                  }}
                >
                  <span>None</span>
                </CommandItem>
                {tags &&
                  tags.map(tag => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => {
                        setSelectedTag(
                          tags.find(tagListTag => tagListTag.id === tag.id) ||
                            null,
                        )
                        setOpen(false)

                        if (isClockedIn) {
                          mutateClockedTime({
                            id: lastClockedTime.id,
                            tagId: tag.id,
                          })
                        }
                      }}
                    >
                      <span>{tag.name}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
