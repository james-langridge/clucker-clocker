import {TrashIcon} from '@radix-ui/react-icons'
import {useRouter} from 'next/navigation'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/alert-dialog'
import {Button} from '@/components/button'
import {useToast} from '@/feature/toaster/use-toast'
import {getErrorMessage} from '@/lib/errors'

export default function DeleteConfirmation({
  id,
  name,
}: {
  id: string
  name: string
}) {
  const router = useRouter()
  const {toast} = useToast()

  // TODO: https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations#optimistic-updates
  async function onClick() {
    toast({
      description: 'Tag deleted!',
    })

    const body = JSON.stringify({
      deleted: true,
      id,
    })

    try {
      const res = await fetch('/api/tags', {
        method: 'PUT',
        body,
      })

      if (!res.ok) {
        toast({
          title: 'Error deleting tag...',
          description: `Something went wrong: ${res.statusText}`,
          variant: 'destructive',
        })
      }

      router.refresh()
    } catch (error) {
      toast({
        title: 'Error deleting tag...',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0">
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">Delete tag</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete tag {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the tag from all times that have it. This action
            cannot be undone!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
