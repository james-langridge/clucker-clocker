'use client'

import {ClockedTime} from '.prisma/client'
import {Tag} from '@prisma/client'
import {ColumnDef} from '@tanstack/react-table'
import {format} from 'date-fns'

import {DataTableColumnHeader} from '@/app/log/data-table-column-header'
import {Badge} from '@/components/ui/badge'

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
    accessorKey: 'start',
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="Start" />
    },
    cell: ({row}) => {
      return format(row.original.start, 'h:mm a')
    },
  },
  {
    accessorKey: 'end',
    accessorFn: row => row.end,
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="End" />
    },
    cell: ({row}) => {
      if (!row.original.end) {
        return null
      }

      return format(row.original.end, 'h:mm a')
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
