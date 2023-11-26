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
import {useTag} from '@/hooks/useTag'

export function AddTagDialog({userId}: {userId?: string}) {
  const [tagName, setTagName] = useState('')
  const {createTagMutation} = useTag({userId})
  const [open, setOpen] = useState(false)

  async function onCreateTag() {
    if (userId) {
      createTagMutation({name: tagName, userId})
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Create</Button>
      </DialogTrigger>
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
    </Dialog>
  )
}
