import {Pencil2Icon} from '@radix-ui/react-icons'
import Link from 'next/link'
import * as React from 'react'

import DeleteConfirmation from '@/app/log/delete-confirmation'
import {Button} from '@/components/ui/button'
import usePrevClockedTime from '@/hooks/usePrevClockedTime'

export default function PrevClockedTime() {
  const {lastClockedTime, prevTime} = usePrevClockedTime()

  return (
    <div className="flex flex-col items-center h-[52px]">
      {lastClockedTime && (
        <>
          <div className="text-lg">Previous clocked time</div>
          <div>{prevTime}</div>
          <div className="flex w-full justify-evenly">
            <DeleteConfirmation id={lastClockedTime.id} />{' '}
            <Link href={`/log/${lastClockedTime.id}`}>
              <Button variant="ghost" className="flex h-8 w-8 p-0">
                <Pencil2Icon className="h-6 w-6" />
              </Button>
              <span className="sr-only">Edit</span>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
