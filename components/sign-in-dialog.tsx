import {ClockIcon} from '@radix-ui/react-icons'

import {signInAction} from '@/app/actions'
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

export default function SignInDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ClockIcon className="text-green-600 h-72 w-72" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Please sign in</AlertDialogTitle>
          <AlertDialogDescription>
            You will soon be able to use the app without signing in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={signInAction}>
            <AlertDialogAction type="submit">Sign in</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
