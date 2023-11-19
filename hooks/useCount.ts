import {useEffect, useState} from 'react'
import {useLocalStorage} from 'usehooks-ts'

type Count = {
  hours: number
  minutes: number
  seconds: number
}

export function useCount() {
  const [count, setCount] = useLocalStorage<Count>('count', {
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [start, setStart] = useState<Date>()
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false)
  const {hours, minutes, seconds} = count

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
  }, [isClockedIn, setCount])

  function toggleCounter() {
    if (!isClockedIn) {
      setStart(new Date())
    }

    if (isClockedIn) {
      setCount({
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    }

    setIsClockedIn(prev => !prev)
  }

  return {hours, isClockedIn, minutes, seconds, start, toggleCounter}
}
