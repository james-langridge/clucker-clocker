'use client'

import {Tag} from '@prisma/client'
import {ColumnDef} from '@tanstack/react-table'

import {Badge} from '@/components/badge'
import {DataTableColumnHeader} from '@/feature/log/table/data-table-column-header'
import DeleteConfirmation from '@/feature/tags/table/delete-confirmation'

export const columns: ColumnDef<Tag>[] = [
  {
    accessorFn: row => row.name,
    accessorKey: 'name',
    header: ({column}) => {
      return <DataTableColumnHeader column={column} title="Tag" />
    },
    cell: ({row}) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{row.original.name}</Badge>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({row}) => {
      return (
        <DeleteConfirmation id={row.original.id} name={row.original.name} />
      )
    },
  },
]
