'use client'

import {ColumnDef} from '@tanstack/react-table'
import dynamic from 'next/dynamic'
import * as React from 'react'
import {useIsClient, useMediaQuery} from 'usehooks-ts'

import {columns} from '@/feature/log/table/columns'
import {mobileColumns} from '@/feature/log/table/mobile-columns'

const DataTable = dynamic(() => import('../../feature/log/table/data-table'))
const MobileDataTable = dynamic(
  () => import('../../feature/log/table/mobile-data-table'),
)

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
  const isLargeScreen = useMediaQuery('(min-width: 1042px)')
  const isClient = useIsClient()

  if (!user) {
    return null
  }

  if (!isClient) {
    return null
  }

  if (isLargeScreen) {
    return (
      <div className="container mx-auto sm:space-y-4">
        <DataTable
          columns={columns as ColumnDef<unknown, unknown>[]}
          data={user.clockedTimes}
          tags={user.tags}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto sm:space-y-4">
      <MobileDataTable
        columns={mobileColumns as ColumnDef<unknown, unknown>[]}
        data={user.clockedTimes}
        tags={user.tags}
      />
    </div>
  )
}
