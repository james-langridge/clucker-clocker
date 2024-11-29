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
]
