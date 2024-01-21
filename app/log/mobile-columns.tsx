'use client'

import {ClockedTime} from '.prisma/client'
import {Tag} from '@prisma/client'
import {ColumnDef} from '@tanstack/react-table'
import {differenceInSeconds, format} from 'date-fns'

import {DataTableColumnHeader} from '@/app/log/data-table-column-header'
import {Badge} from '@/components/ui/badge'
import {getDuration} from '@/lib/utils'

export const mobileColumns: ColumnDef<ClockedTime & {tag: Tag | null}>[] = [
  {
    id: 'day',
    accessorFn: row => row.start,
    accessorKey: 'day',
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="Day" />
    },
    cell: ({row}) => {
      return format(row.original.start, 'dd.MM.yy')
    },
  },
  {
    accessorFn: row => row.start,
    accessorKey: 'time',
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="Time" />
    },
    cell: ({row}) => {
      return format(row.original.start, 'h:mm a')
    },
  },
  {
    accessorKey: 'duration',
    accessorFn: row => {
      if (!row.end) {
        return null
      }

      return differenceInSeconds(new Date(row.end), new Date(row.start))
    },
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="Duration" />
    },
    cell: ({row}) => {
      if (!row.original.end) {
        return null
      }

      return getDuration(row.original.start, row.original.end)
    },
  },
  {
    accessorFn: row => row.tag?.name,
    accessorKey: 'tag',
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="Tag" />
    },
    cell: ({row}) => {
      if (!row.original.tag) {
        return null
      }

      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{row.original.tag.name}</Badge>
        </div>
      )
    },
  },
]
