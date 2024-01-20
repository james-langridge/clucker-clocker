'use client'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {useState} from 'react'

import UserIdProvider from '@/app/user-id-provider'

export default function Providers({children}: {children: React.ReactNode}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            // TODO: override this staleTime in some queries?
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <UserIdProvider>{children}</UserIdProvider>
    </QueryClientProvider>
  )
}

/*
https://tanstack.com/query/latest/docs/react/guides/ssr#staleness-is-measured-from-when-the-query-was-fetched-on-the-server

Staleness is measured from when the query was fetched on the server

A query is considered stale depending on when it was dataUpdatedAt. A caveat here is that the server needs to have the correct time for this to work properly, but UTC time is used, so timezones do not factor into this.

Because staleTime defaults to 0, queries will be refetched in the background on page load by default. You might want to use a higher staleTime to avoid this double fetching, especially if you don't cache your markup.

This refetching of stale queries is a perfect match when caching markup in a CDN! You can set the cache time of the page itself decently high to avoid having to re-render pages on the server, but configure the staleTime of the queries lower to make sure data is refetched in the background as soon as a user visits the page. Maybe you want to cache the pages for a week, but refetch the data automatically on page load if it's older than a day?

 */
