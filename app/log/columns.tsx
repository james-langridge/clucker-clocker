'use client'

import {ClockedTime} from '.prisma/client'
import {Tag} from '@prisma/client'
import {Pencil2Icon} from '@radix-ui/react-icons'
import {ColumnDef} from '@tanstack/react-table'
import {differenceInSeconds, format} from 'date-fns'
import Link from 'next/link'

import {DataTableColumnHeader} from '@/app/log/data-table-column-header'
import DeleteConfirmation from '@/app/log/delete-confirmation'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {getDuration} from '@/lib/utils'

export const columns: ColumnDef<ClockedTime & {tag: Tag | null}>[] = [
  {
    id: 'select',
    header: ({table}) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: unknown) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: unknown) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'startDay',
    accessorFn: row => row.start,
    accessorKey: 'startDay',
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="Start day" />
    },
    cell: ({row}) => {
      return format(row.original.start, 'dd.MM.yy')
    },
  },
  {
    accessorFn: row => row.start,
    accessorKey: 'startTime',
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="Start time" />
    },
    cell: ({row}) => {
      return format(row.original.start, 'h:mm a')
    },
  },
  {
    accessorFn: row => row.end,
    accessorKey: 'endDay',
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="End day" />
    },
    cell: ({row}) => {
      if (row.original.end) {
        return format(row.original.end, 'dd.MM.yy')
      }

      return null
    },
  },
  {
    accessorFn: row => row.end,
    accessorKey: 'endTime',
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="End time" />
    },
    cell: ({row}) => {
      if (row.original.end) {
        return format(row.original.end, 'h:mm a')
      }

      return null
    },
  },
  {
    accessorFn: row => {
      if (!row.end) {
        return null
      }

      return differenceInSeconds(new Date(row.end), new Date(row.start))
    },
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="Duration" />
    },
    accessorKey: 'duration',
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
  {
    id: 'actions',
    cell: ({row}) => {
      return (
        <div className="flex">
          <DeleteConfirmation id={row.original.id} />{' '}
          <Link href={`/log/${row.original.id}`}>
            <Button variant="ghost" className="flex h-8 w-8 p-0">
              <Pencil2Icon className="h-4 w-4" />
            </Button>
            <span className="sr-only">Edit</span>
          </Link>
        </div>
      )
    },
  },
]
