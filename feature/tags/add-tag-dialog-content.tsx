import {Dispatch, SetStateAction, useState} from 'react'

import {Button} from '@/components/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog'
import {Input} from '@/components/input'
import {Label} from '@/components/label'
import {useTag} from '@/hooks/useTag'

export default function AddTagDialogContent({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const {createTagMutation} = useTag()
  const [tagName, setTagName] = useState('')

  async function onCreateTag() {
    createTagMutation({name: tagName})
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
