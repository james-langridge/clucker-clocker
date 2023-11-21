import {auth} from '@/auth'
import ClockInButton from '@/components/clock-in-button'

export default async function Home() {
  const session = await auth()

  return <ClockInButton userId={session?.user?.id} />
}
