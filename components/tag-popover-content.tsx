import {ClockedTime} from '.prisma/client'
import {Tag} from '@prisma/client'
import * as React from 'react'
import {Dispatch, SetStateAction} from 'react'

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
  setSelectedTag,
  lastClockedTime,
  userId,
}: {
  tags?: Tag[]
  setOpen: Dispatch<SetStateAction<boolean>>
  setSelectedTag: Dispatch<SetStateAction<Tag | null>>
  lastClockedTime?: ClockedTime
  userId?: string
}) {
  const isClockedIn = lastClockedTime && !lastClockedTime.end
  const {mutateClockedTime} = useClockedTime({userId})

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
                      tags.find(tagListTag => tagListTag.id === tag.id) || null,
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
  )
}
