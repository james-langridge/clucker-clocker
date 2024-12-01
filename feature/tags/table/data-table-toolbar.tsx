'use client'

import {Table} from '@tanstack/react-table'

import {Input} from '@/components/input'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({table}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-start">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Filter tags..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  )
}
