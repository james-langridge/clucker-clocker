import dynamic from 'next/dynamic'
import {useState} from 'react'

import {Button} from '@/components/button'
import {Dialog, DialogTrigger} from '@/components/dialog'

const DialogContent = dynamic(() => import('./add-tag-dialog-content'))

export default function AddTagDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Create</Button>
      </DialogTrigger>
      {open && <DialogContent setOpen={setOpen} />}
    </Dialog>
  )
}
