import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useState} from 'react'
import * as React from 'react'

import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {useToast} from '@/components/ui/use-toast'
import {createTag} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'

export function TagDialog({
  userId,
  children,
}: {
  userId?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const {toast} = useToast()
  const queryClient = useQueryClient()
  const {mutate} = useMutation({
    mutationFn: createTag,
    onMutate: () => {
      toast({
        description: 'Tag created!',
      })
      setOpen(false)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tags', userId]})
    },
    onError: error => {
      toast({
        title: 'Error creating tag...',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    },
  })

  async function handleClick() {
    if (userId) {
      mutate({name, userId})
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New tag</DialogTitle>
          <DialogDescription>
            Create a new tag. Click add when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClick}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
