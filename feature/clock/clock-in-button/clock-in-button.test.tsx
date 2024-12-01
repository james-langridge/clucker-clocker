import {screen, fireEvent, waitFor} from '@testing-library/react'
import {http, HttpResponse} from 'msw'

import {renderWithClient} from '@/lib/test-utils'
import {server} from '@/mocks/node'

import ClockInButton from './clock-in-button'

describe('ClockInButton Integration', () => {
  it('renders initially with clocked out state', async () => {
    renderWithClient(<ClockInButton />)

    await waitFor(() => {
      const icon = screen.getByRole('button').firstChild
      expect(icon).toHaveClass('text-green-600')
      expect(icon).not.toHaveClass('animate-spin-slow')
    })
  })

  it('changes styles when clocking in', async () => {
    renderWithClient(<ClockInButton />)

    await waitFor(() => {
      const icon = screen.getByRole('button').firstChild
      expect(icon).toHaveClass('text-green-600')
    })

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      const icon = screen.getByRole('button').firstChild
      expect(icon).toHaveClass('text-blue-600')
      expect(icon).toHaveClass('animate-spin-slow')
    })
  })

  it('handles error states correctly', async () => {
    server.use(
      http.post('/api/clock-in', () => {
        return HttpResponse.error()
      }),
    )

    renderWithClient(<ClockInButton />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      const icon = screen.getByRole('button').firstChild
      expect(icon).toHaveClass('text-green-600')
    })
  })
})
