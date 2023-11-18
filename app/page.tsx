import ClockInButton from '@/components/clock-in-button'
import {auth} from '@/auth'

export default async function Home() {
  const session = await auth()

  return <ClockInButton userId={session?.user?.id} />
}
