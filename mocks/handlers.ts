import {http, HttpResponse} from 'msw'

export const handlers = [
  http.get('/api/clock-in', () => {
    return HttpResponse.json({isClockedIn: false})
  }),

  http.post('/api/clock-in', () => {
    return HttpResponse.json({isClockedIn: true})
  }),

  http.post('/api/clock-out', () => {
    return HttpResponse.json({isClockedIn: false})
  }),

  http.get('/api/clocked-times', () => {
    return HttpResponse.json({
      data: {
        id: 1,
        start: '2024-11-29T13:00:00.000Z',
        end: '2024-11-29T17:00:00.000Z',
      },
    })
  }),

  http.post('/api/clocked-times', async ({request}) => {
    const body = (await request.json()) as {start: string; end: string}
    return HttpResponse.json({
      id: Math.random(),
      ...body,
    })
  }),
]
