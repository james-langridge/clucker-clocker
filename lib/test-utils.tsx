import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render} from '@testing-library/react'
import * as React from 'react'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient()
  const {rerender, ...result} = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  )
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {rerenderUi}
        </QueryClientProvider>,
      ),
  }
}

export function createWrapper() {
  const testQueryClient = createTestQueryClient()
  const Wrapper = ({children}: {children: React.ReactNode}) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  )
  Wrapper.displayName = 'QueryClientWrapper'
  return Wrapper
}
