import {Tag} from '@prisma/client'
import * as React from 'react'
import {useState} from 'react'

import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {useClockedTime} from '@/hooks/useClockedTime'
import {useCount} from '@/hooks/useCount'
import {useTag} from '@/hooks/useTag'

export default function TagDialog({
  userId,
  children,
}: {
  userId?: string
  children: React.ReactNode
}) {
  const {lastClockedTime} = useCount(userId)
  const [open, setOpen] = useState(false)
  const [tag, setTag] = React.useState<Tag | null>(null)
  const [tagName, setTagName] = useState('')
  const {tags} = useTag({userId})
  const {createTagMutation} = useTag({userId})
  const {mutateClockedTime} = useClockedTime({userId})

  function onAddTag(tag: Tag | null) {
    if (tag && lastClockedTime) {
      setTag(tag)
      setOpen(false)
      mutateClockedTime({id: lastClockedTime.id, tagId: tag.id})
    }
  }

  async function onCreateTag() {
    if (userId) {
      createTagMutation({name: tagName, userId})
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a tag?</DialogTitle>
        </DialogHeader>

        <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
          {tags &&
            tags.map(tag => (
              <div key={tag.id}>
                <RadioGroupItem
                  value={tag.name}
                  id={tag.name}
                  className="peer sr-only"
                  onClick={() => setTag(tag)}
                />

                <Label
                  htmlFor={tag.name}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {tag.name}
                </Label>
              </div>
            ))}
        </RadioGroup>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            id="name"
            className="col-span-3"
            value={tagName}
            type="text"
            placeholder="Tag name"
            onChange={e => setTagName(e.target.value)}
          />
          <Button onClick={onCreateTag}>Create</Button>
        </div>
        <DialogFooter>
          <Button onClick={() => onAddTag(tag)}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
