import {Dispatch, SetStateAction, useState} from 'react'

import {Button} from '@/components/ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {useTag} from '@/hooks/useTag'

export default function AddTagDialogContent({
  userId,
  setOpen,
}: {
  userId?: string
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const {createTagMutation} = useTag({userId})
  const [tagName, setTagName] = useState('')

  async function onCreateTag() {
    if (userId) {
      createTagMutation({name: tagName, userId})
    }

    setOpen(false)
  }

  return (
    <DialogContent className="max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New tag</DialogTitle>
      </DialogHeader>
      <div className="flex items-center space-x-2 justify-end">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={tagName}
          type="text"
          placeholder="Tag"
          onChange={e => setTagName(e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button type="submit" onClick={onCreateTag}>
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
