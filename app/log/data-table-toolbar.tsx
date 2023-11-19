'use client'

import {Tag} from '@prisma/client'
import {Cross2Icon} from '@radix-ui/react-icons'
import {Table} from '@tanstack/react-table'

import {DataTableViewOptions} from '@/app/log/data-table-view-options'
import {Button} from '@/components/ui/button'

import {DataTableFacetedFilter} from './data-table-faceted-filter'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  tags: Tag[]
}

export function DataTableToolbar<TData>({
  table,
  tags,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const options = tags.map(tag => {
    return {
      value: tag.name,
      label: tag.name,
    }
  })

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/*TODO*/}
        {/*<Input*/}
        {/*  placeholder="Filter times..."*/}
        {/*  value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}*/}
        {/*  onChange={event =>*/}
        {/*    table.getColumn('description')?.setFilterValue(event.target.value)*/}
        {/*  }*/}
        {/*  className="h-8 w-[150px] lg:w-[250px]"*/}
        {/*/>*/}
        {table.getColumn('tags') && (
          <DataTableFacetedFilter
            column={table.getColumn('tags')}
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
