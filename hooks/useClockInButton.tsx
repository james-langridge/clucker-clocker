import {useSelectedTag} from '@/app/selected-tag-provider'
import {useUserId} from '@/app/user-id-provider'
import useClockedTime, {useLastClockedTime} from '@/hooks/useClockedTime'

export function useClockInButton() {
  const {userId} = useUserId()
  const {selectedTag} = useSelectedTag()
  const {clockIn, clockOut} = useClockedTime()
  const {lastClockedTime} = useLastClockedTime()
  const isClockedIn = lastClockedTime && !lastClockedTime.end

  const toggleClockIn = async () => {
    if (!isClockedIn && userId) {
      clockIn.mutate({
        start: new Date(),
        userId,
        ...(selectedTag && {tagId: selectedTag.id}),
      })
    }

    if (isClockedIn && lastClockedTime) {
      clockOut.mutate({
        ...lastClockedTime,
        end: new Date(),
      })
    }
  }

  return {isClockedIn, toggleClockIn}
}
