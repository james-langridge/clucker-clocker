import {Tag} from '@prisma/client'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import * as React from 'react'
import {useEffect, useState} from 'react'

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {useToast} from '@/components/ui/use-toast'
import {createTag, getTags, getUser, updateClockedTime} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'

export function TagMenuGroup({userId}: {userId?: string}) {
  const {toast} = useToast()
  const {data: tags} = useQuery({
    queryKey: ['tags', userId],
    queryFn: () => getTags(userId),
    refetchInterval: 2500,
  })
  const {data: user} = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    refetchInterval: 2500,
  })
  const activeId = user?.clockedTimes[0]?.id
  const {mutate: mutateClockedTime} = useMutation({
    mutationFn: updateClockedTime,
    onMutate: variables => {
      const tag = tags?.find(tag => tag.id === variables.tagId)

      if (tag) {
        toast({
          description: `Tagged with ${tag.name}!`,
        })
      }
    },
    onError: error => {
      toast({
        title: 'Error tagging...',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    },
  })
  const [tag, setTag] = React.useState<Tag | null>(null)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
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

  useEffect(() => {
    const tagId = user?.clockedTimes.length ? user.clockedTimes[0].tagId : null

    if (tagId) {
      const tag = tags?.find(tag => tag.id === tagId)

      if (tag) {
        setTag(tag)
      }
    }
  }, [tags, user])

  function onClick(tag: Tag) {
    console.log(tag.name)
    if (activeId) {
      setTag(tag)
      mutateClockedTime({id: activeId, tagId: tag.id})
    } else {
      toast({
        title: 'Not clocked in!',
        description: 'Clock in first, then pick a tag.',
      })
    }
  }

  async function handleClick() {
    if (userId) {
      mutate({name, userId})
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Tags</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Pick a tag</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={tag?.name}>
            <DropdownMenuRadioItem value="none">No tag</DropdownMenuRadioItem>
            {tags?.map(tag => (
              <DropdownMenuRadioItem
                key={tag.id}
                value={tag.name}
                onClick={() => onClick(tag)}
              >
                {tag.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>Create tag</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
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
