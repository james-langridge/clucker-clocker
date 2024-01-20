import {ClockedTime} from '.prisma/client'
import {Tag} from '@prisma/client'
import * as React from 'react'
import {Dispatch, SetStateAction} from 'react'

import {useSelectedTag} from '@/app/selected-tag-provider'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {PopoverContent} from '@/components/ui/popover'
import {useClockedTime} from '@/hooks/useClockedTime'

export default function TagPopoverContent({
  tags,
  setOpen,
  lastClockedTime,
}: {
  tags?: Tag[]
  setOpen: Dispatch<SetStateAction<boolean>>
  lastClockedTime?: ClockedTime
}) {
  const {setSelectedTag} = useSelectedTag()
  const isClockedIn = lastClockedTime && !lastClockedTime.end
  const {updateClockedTimeMutation} = useClockedTime()

  return (
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
                  updateClockedTimeMutation({
                    ...lastClockedTime,
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
                      tags.find(tagListTag => tagListTag.id === tag.id) || null,
                    )
                    setOpen(false)

                    if (isClockedIn) {
                      updateClockedTimeMutation({
                        ...lastClockedTime,
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
  )
}
