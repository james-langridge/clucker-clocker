'use client'

import {Tag} from '@prisma/client'
import {ColumnDef} from '@tanstack/react-table'
import dynamic from 'next/dynamic'
import * as React from 'react'

import {columns} from '@/app/tags/columns'

const DynamicDataTable = dynamic(() => import('./data-table'))

export default function TagsPage({tags}: {tags: Tag[]}) {
  return (
    <DynamicDataTable
      columns={columns as ColumnDef<unknown, unknown>[]}
      data={tags}
    />
  )
}
