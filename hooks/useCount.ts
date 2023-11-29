import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns'
import {useEffect, useState} from 'react'

import {useClockedTime} from '@/hooks/useClockedTime'

type Count = {
  hours: number
  minutes: number
  seconds: number
}

export function useCount(userId?: string) {
  const {lastClockedTime} = useClockedTime({userId})
  const isClockedIn = lastClockedTime && !lastClockedTime.end
  const [count, setCount] = useState<Count>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const {hours, minutes, seconds} = count

  useEffect(() => {
    if (!isClockedIn) {
      setCount({
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    }
  }, [isClockedIn])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isClockedIn) {
      intervalId = setInterval(() => {
        setCount(() => {
          const endDate = new Date()
          const start = new Date(lastClockedTime.start)

          const hours = differenceInHours(endDate, start)
          const minutes = differenceInMinutes(endDate, start) % 60
          const seconds = differenceInSeconds(endDate, start) % 60

          return {hours, minutes, seconds}
        })
      }, 1000)
    }

    return () => clearInterval(intervalId)
  }, [isClockedIn, lastClockedTime?.start])

  return {
    hours,
    minutes,
    seconds,
    isClockedIn,
  }
}
