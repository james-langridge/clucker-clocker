'use client'

import {Tag} from '@prisma/client'
import {ColumnDef} from '@tanstack/react-table'

import {DataTableColumnHeader} from '@/app/log/data-table-column-header'
import DeleteConfirmation from '@/app/tags/delete-confirmation'
import {Badge} from '@/components/ui/badge'

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
