import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'

import HomePage from '@/app/home-page'
import {auth} from '@/auth'
import {getLastClockedTime, getTags} from '@/lib/api'

export default async function Home() {
  const session = await auth()
  const queryClient = new QueryClient()

  // Prefetch this data on the server to make it immediately available on the client
  await queryClient.prefetchQuery({
    queryKey: ['lastClockedTime'],
    queryFn: () => getLastClockedTime(),
  })

  await queryClient.prefetchQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage userId={session?.user?.id} />
    </HydrationBoundary>
  )
}
