'use client'

import {ClockedTime} from '.prisma/client'
import {Tag} from '@prisma/client'
import {Pencil2Icon} from '@radix-ui/react-icons'
import {ColumnDef} from '@tanstack/react-table'
import {differenceInSeconds, format} from 'date-fns'
import {ArrowUpDown} from 'lucide-react'
import Link from 'next/link'

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
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Start Day
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      return format(row.original.start, 'EEE, MMM d, yyyy')
    },
  },
  {
    accessorFn: row => row.start,
    accessorKey: 'startTime',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Start Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      return format(row.original.start, 'h:mm a')
    },
  },
  {
    accessorFn: row => row.end,
    accessorKey: 'endDay',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          End Day
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      if (row.original.end) {
        return format(row.original.end, 'EEE, MMM d, yyyy')
      }

      return null
    },
  },
  {
    accessorFn: row => row.end,
    accessorKey: 'endTime',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          End Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
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
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
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
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tag
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
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
