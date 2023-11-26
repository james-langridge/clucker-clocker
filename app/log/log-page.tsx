'use client'

import * as React from 'react'
import {useIsClient, useMediaQuery} from 'usehooks-ts'

import {columns} from '@/app/log/columns'
import {DataTable} from '@/app/log/data-table'
import {mobileColumns} from '@/app/log/mobile-columns'
import {MobileDataTable} from '@/app/log/mobile-data-table'
import {AddTimeForm} from '@/components/add-time-form'

type User =
  | {
      id: string
      clockedTimes: ({
        tag: {id: string; name: string; userId: string; deleted: boolean} | null
      } & {
        id: string
        start: Date
        end: Date | null
        userId: string
        tagId: string | null
        deleted: boolean
      })[]
      tags: {id: string; name: string; userId: string; deleted: boolean}[]
    }
  | null
  | undefined

export default function LogPage({user}: {user: User}) {
  const isNotMobile = useMediaQuery('(min-width: 640px)')
  const isClient = useIsClient()

  if (!user) {
    return null
  }

  if (!isClient) {
    return null
  }

  if (isNotMobile) {
    return (
      <div className="container mx-auto sm:space-y-4">
        <AddTimeForm tags={user.tags} userId={user.id} />
        <DataTable
          columns={columns}
          data={user.clockedTimes}
          tags={user.tags}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto sm:space-y-4 px-2">
      <MobileDataTable columns={mobileColumns} data={user.clockedTimes} />
    </div>
  )
}
