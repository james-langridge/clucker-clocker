import {Column} from '@tanstack/react-table'
import {ArrowUpDown} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className={cn('px-2', className)}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}
