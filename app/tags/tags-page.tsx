'use client'

import {Tag} from '@prisma/client'
import {ColumnDef} from '@tanstack/react-table'
import dynamic from 'next/dynamic'
import * as React from 'react'

import {columns} from '@/feature/tags/table/columns'

const DataTable = dynamic(() => import('../../feature/tags/table/data-table'))

export default function TagsPage({tags}: {tags: Tag[]}) {
  return (
    <DataTable columns={columns as ColumnDef<unknown, unknown>[]} data={tags} />
  )
}
