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
  const [start, setStart] = useState<Date>()
  const {lastClockedTime} = useClockedTime({userId, start})
  const [count, setCount] = useState<Count>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false)
  const {hours, minutes, seconds} = count

  useEffect(() => {
    if (!lastClockedTime) {
      return
    }

    if (!lastClockedTime.end) {
      setStart(new Date(lastClockedTime.start))
      setIsClockedIn(true)
    } else if (lastClockedTime.end) {
      setIsClockedIn(false)
      setCount({
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    }
  }, [lastClockedTime])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isClockedIn && start) {
      intervalId = setInterval(() => {
        setCount(() => {
          const endDate = new Date()

          const hours = differenceInHours(endDate, start)
          const minutes = differenceInMinutes(endDate, start) % 60
          const seconds = differenceInSeconds(endDate, start) % 60

          return {hours, minutes, seconds}
        })
      }, 1000)
    }

    return () => clearInterval(intervalId)
  }, [isClockedIn, setCount, start])

  function toggleCounter() {
    if (isClockedIn) {
      setCount({
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    }

    setIsClockedIn(prev => !prev)
  }

  return {
    lastClockedTime,
    hours,
    isClockedIn,
    minutes,
    seconds,
    start,
    toggleCounter,
  }
}
