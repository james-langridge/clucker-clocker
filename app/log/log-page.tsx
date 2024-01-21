'use client'

import {ColumnDef} from '@tanstack/react-table'
import dynamic from 'next/dynamic'
import * as React from 'react'
import {useIsClient, useMediaQuery} from 'usehooks-ts'

import {columns} from '@/app/log/columns'
import {mobileColumns} from '@/app/log/mobile-columns'

const DataTable = dynamic(() => import('./data-table'))
const MobileDataTable = dynamic(() => import('./mobile-data-table'))

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
  const isLargeScreen = useMediaQuery('(min-width: 1536px)')
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
    <div className="container mx-auto sm:space-y-4 px-2">
      <MobileDataTable
        columns={mobileColumns as ColumnDef<unknown, unknown>[]}
        data={user.clockedTimes}
        tags={user.tags}
      />
    </div>
  )
}
