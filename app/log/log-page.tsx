'use client'

import {ColumnDef} from '@tanstack/react-table'
import dynamic from 'next/dynamic'
import * as React from 'react'
import {useIsClient, useMediaQuery} from 'usehooks-ts'

import {columns} from '@/app/log/columns'
import {mobileColumns} from '@/app/log/mobile-columns'
import {Separator} from '@/components/ui/separator'

const DataTable = dynamic(() => import('./data-table'))
const ClockedTimeForm = dynamic(() => import('@/components/clocked-time-form'))
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
        <div className="grid lg:grid-cols-5 gap-20">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Clock a time</h3>
              <p className="text-sm text-muted-foreground">
                Forgot to clock in? Don&apos;t cluck out. You can add it here.
              </p>
            </div>
            <Separator />
            <ClockedTimeForm tags={user.tags} userId={user.id} />
          </div>

          <div className="col-span-3 lg:col-span-4">
            <DataTable
              columns={columns as ColumnDef<unknown, unknown>[]}
              data={user.clockedTimes}
              tags={user.tags}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto sm:space-y-4 px-2">
      <MobileDataTable
        columns={mobileColumns as ColumnDef<unknown, unknown>[]}
        data={user.clockedTimes}
      />
    </div>
  )
}
