import {useSelectedTag} from '@/app/selected-tag-provider'
import useClockedTime, {useLastClockedTime} from '@/hooks/useClockedTime'

export function useClockInButton() {
  const {selectedTag} = useSelectedTag()
  const {clockIn, clockOut} = useClockedTime()
  const lastClockedTimeQuery = useLastClockedTime()
  const isClockedIn = lastClockedTimeQuery.isSuccess
    ? lastClockedTimeQuery.data
      ? !lastClockedTimeQuery.data.end
      : false
    : false

  const toggleClockIn = async () => {
    if (!isClockedIn) {
      clockIn.mutate({
        start: new Date(),
        ...(selectedTag && {tagId: selectedTag.id}),
      })
    }

    if (isClockedIn && lastClockedTimeQuery.data?.id) {
      clockOut.mutate({
        ...lastClockedTimeQuery.data,
        end: new Date(),
      })
    }
  }

  return {isClockedIn, toggleClockIn}
}
