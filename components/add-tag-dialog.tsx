import dynamic from 'next/dynamic'
import {useState} from 'react'

import {Button} from '@/components/ui/button'
import {Dialog, DialogTrigger} from '@/components/ui/dialog'

const DynamicDialogContent = dynamic(() => import('./add-tag-dialog-content'))

export default function AddTagDialog({userId}: {userId?: string}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Create</Button>
      </DialogTrigger>
      {open && <DynamicDialogContent userId={userId} setOpen={setOpen} />}
    </Dialog>
  )
}
