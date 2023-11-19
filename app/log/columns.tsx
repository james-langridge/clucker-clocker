'use client'

import {ClockedTime} from '.prisma/client'
import {Tag} from '@prisma/client'
import {ColumnDef} from '@tanstack/react-table'
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from 'date-fns'
import {ArrowUpDown} from 'lucide-react'

import DeleteConfirmation from '@/app/log/delete-confirmation'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'

export const columns: ColumnDef<ClockedTime & {tags: Tag[]}>[] = [
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
      return format(row.original.end, 'EEE, MMM d, yyyy')
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
      return format(row.original.end, 'h:mm a')
    },
  },
  {
    accessorFn: row => {
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
      const startDate = new Date(row.original.start)
      const endDate = new Date(row.original.end)
      const hours = differenceInHours(endDate, startDate)
      const minutes = differenceInMinutes(endDate, startDate) % 60
      const seconds = differenceInSeconds(endDate, startDate) % 60

      let duration = `${seconds} s`

      if (minutes) {
        duration = `${minutes} m ` + duration
      }

      if (hours) {
        duration = `${hours} h ` + duration
      }

      return duration
    },
  },
  {
    accessorFn: row => row.tags,
    accessorKey: 'tags',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tags
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      return (
        <div className="flex space-x-2">
          {row.original.tags.map(tag => {
            return (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            )
          })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({row}) => {
      return <DeleteConfirmation id={row.original.id} />
    },
  },
]
