'use client'

import {Tag} from '@prisma/client'
import {Cross2Icon} from '@radix-ui/react-icons'
import {Table} from '@tanstack/react-table'
import {useRouter} from 'next/navigation'

import {Button} from '@/components/button'
import {DataTableViewOptions} from '@/feature/log/table/data-table-view-options'

import {DataTableFacetedFilter} from './data-table-faceted-filter'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  tags: Tag[]
}

export function DataTableToolbar<TData>({
  table,
  tags,
}: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const isFiltered = table.getState().columnFilters.length > 0

  const options = tags.map(tag => {
    return {
      value: tag.name,
      label: tag.name,
    }
  })

  return (
    <div className="flex items-center justify-end">
      <Button
        variant="outline"
        className="h-8 px-2 lg:px-3 mr-4"
        onClick={() => router.push('/log/add')}
      >
        + Create
      </Button>
      <div className="flex items-center space-x-2">
        {table.getColumn('tag') && (
          <DataTableFacetedFilter
            column={table.getColumn('tag')}
            title="Tag"
            options={options}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
