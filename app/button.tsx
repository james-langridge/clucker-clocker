'use client'

import {useEffect, useState} from 'react'
import {clsx} from 'clsx'
import {useLocalStorage} from 'usehooks-ts'

type Count = {
  hours: number
  minutes: number
  seconds: number
}

export default function Button() {
  const [count, setCount] = useLocalStorage<Count>('count', {
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false)
  const [isClient, setIsClient] = useState(false)
  const {hours, minutes, seconds} = count

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isClockedIn) {
      intervalId = setInterval(() => {
        setCount(prev => {
          const {hours, minutes, seconds} = prev

          if (seconds === 60) {
            if (minutes < 60) {
              return {...prev, minutes: minutes + 1, seconds: 0}
            }

            if (minutes === 60) {
              return {hours: hours + 1, minutes: 0, seconds: 0}
            }
          }

          return {...prev, seconds: seconds + 1}
        })
      }, 1000)
    }

    return () => clearInterval(intervalId)
  }, [isClockedIn])

  function toggleCounter() {
    setIsClockedIn(prev => !prev)
  }

  if (!isClient) {
    return null
  }

  return (
    <button
      onClick={toggleCounter}
      className={clsx(
        isClockedIn && 'bg-fuchsia-600',
        !isClockedIn && 'bg-emerald-700',
        'bg-emerald-700 w-full h-full rounded-full',
      )}
    >
      {hours}h {minutes}m {seconds}s
    </button>
  )
}
