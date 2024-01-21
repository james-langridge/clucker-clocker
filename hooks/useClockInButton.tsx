import {useSelectedTag} from '@/app/selected-tag-provider'
import useClockedTime, {useLastClockedTime} from '@/hooks/useClockedTime'

export function useClockInButton() {
  const {selectedTag} = useSelectedTag()
  const {clockIn, clockOut} = useClockedTime()
  const {lastClockedTime} = useLastClockedTime()
  const isClockedIn = lastClockedTime && !lastClockedTime.end

  const toggleClockIn = async () => {
    if (!isClockedIn) {
      clockIn.mutate({
        start: new Date(),
        ...(selectedTag && {tagId: selectedTag.id}),
      })
    }

    if (isClockedIn && lastClockedTime.id) {
      clockOut.mutate({
        ...lastClockedTime,
        end: new Date(),
      })
    }
  }

  return {isClockedIn, toggleClockIn}
}
