import {useQuery} from '@tanstack/react-query'
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns'
import {useEffect, useState} from 'react'

import {getUser} from '@/lib/api'

type Count = {
  hours: number
  minutes: number
  seconds: number
}

export function useCount(userId?: string) {
  const {data} = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    refetchInterval: 2500,
  })
  const [start, setStart] = useState<Date>()
  const activeId = data?.clockedTimes[0]?.id
  const [count, setCount] = useState<Count>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false)
  const {hours, minutes, seconds} = count

  useEffect(() => {
    if (data?.clockedTimes.length) {
      setStart(new Date(data.clockedTimes[0].start))
      setIsClockedIn(true)
    } else if (!data?.clockedTimes.length) {
      setIsClockedIn(false)
      setCount({
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    }
  }, [data])

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
    activeId,
    hours,
    isClockedIn,
    minutes,
    seconds,
    start,
    toggleCounter,
  }
}
