import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'

import {auth} from '@/auth'
import Clock from '@/components/clock'
import {getLastClockedTime, getTags} from '@/lib/api'

export default async function Home() {
  const session = await auth()
  const userId = session?.user?.id
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['lastClockedTime', userId],
    queryFn: () => getLastClockedTime(userId),
  })

  await queryClient.prefetchQuery({
    queryKey: ['tags', userId],
    queryFn: () => getTags(userId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Clock userId={session?.user?.id} />
    </HydrationBoundary>
  )
}
