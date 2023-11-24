import {auth} from '@/auth'
import Clock from '@/components/clock'

export default async function Home() {
  const session = await auth()

  return <Clock userId={session?.user?.id} />
}
