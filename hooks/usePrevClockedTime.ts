import {ClockedTime} from '.prisma/client'
import {format} from 'date-fns'
import isEqual from 'lodash/isEqual'
import {useEffect, useState} from 'react'

import {useLastClockedTime} from '@/hooks/useClockedTime'

export default function usePrevClockedTime() {
  const {data: lastClockedTime} = useLastClockedTime()
  const [prevTime, setPrevTime] = useState('')
  const [last2ClockedTimes, setLast2ClockedTimes] = useState<ClockedTime[]>([])

  useEffect(() => {
    if (!lastClockedTime?.id) return

    const idx = last2ClockedTimes.findIndex(t => t.id === lastClockedTime.id)
    const isIdInArray = idx !== -1
    const isSame = isEqual(lastClockedTime, last2ClockedTimes[idx])

    if (lastClockedTime.deleted && isIdInArray) {
      setLast2ClockedTimes(prev => {
        return [...prev].filter(t => t.id === lastClockedTime.id)
      })
      return
    }

    if (last2ClockedTimes.length < 2 && !isIdInArray) {
      setLast2ClockedTimes(prev => [...prev, lastClockedTime])
      return
    }

    if (last2ClockedTimes.length >= 2 && !isIdInArray) {
      setLast2ClockedTimes(prev => {
        const newArr = [...prev]
        newArr.shift()
        newArr.push(lastClockedTime)
        return newArr
      })
      return
    }

    // No-op if time already in array with no change
    if (isSame) return

    // Time has been updated
    setLast2ClockedTimes(prev => {
      const newArr = [...prev]
      newArr[idx] = lastClockedTime

      return newArr
    })
  }, [last2ClockedTimes, lastClockedTime])

  useEffect(() => {
    let time

    if (last2ClockedTimes.length === 1 && last2ClockedTimes[0].end) {
      time = last2ClockedTimes[0]
    } else if (last2ClockedTimes.length === 2 && last2ClockedTimes[1].end) {
      time = last2ClockedTimes[1]
    } else {
      time = last2ClockedTimes[0]
    }

    if (!time || !time.end) return

    const day = format(new Date(time.start), 'dd.MM.yy')
    const start = format(new Date(time.start), 'h:mm a')
    const end = format(new Date(time.end), 'h:mm a')

    setPrevTime(`${day} from ${start} to ${end}`)
  }, [last2ClockedTimes])

  return {lastClockedTime, prevTime}
}
