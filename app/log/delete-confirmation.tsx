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
} from '@/components/ui/alert-dialog'
import {Button} from '@/components/ui/button'
import {useToast} from '@/components/ui/use-toast'
import {getErrorMessage} from '@/lib/errors'

export default function DeleteConfirmation({id}: {id: string}) {
  const router = useRouter()
  const {toast} = useToast()

  // TODO: https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations#optimistic-updates
  async function onClick() {
    toast({
      description: 'Time deleted!',
    })

    const body = JSON.stringify({
      deleted: true,
      id,
    })

    try {
      const res = await fetch('/api/clocked-times', {
        method: 'PUT',
        body,
      })

      if (!res.ok) {
        toast({
          title: 'Error clocking time...',
          description: `Something went wrong: ${res.statusText}`,
          variant: 'destructive',
        })
      }

      router.refresh()
    } catch (error) {
      toast({
        title: 'Error deleting time...',
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
          <span className="sr-only">Delete time</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this time?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone!
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
