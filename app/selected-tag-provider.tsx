import {Tag} from '@prisma/client'
import React, {Dispatch, SetStateAction, useContext} from 'react'

interface SelectedTagContextType {
  selectedTag: Tag | null
  setSelectedTag: Dispatch<SetStateAction<Tag | null>>
}

const SelectedTagContext = React.createContext<SelectedTagContextType>({
  selectedTag: null,
  setSelectedTag: () => {},
})

export const useSelectedTag = () => useContext(SelectedTagContext)

export default function SelectedTagProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [selectedTag, setSelectedTag] = React.useState<Tag | null>(null)

  const value = {selectedTag, setSelectedTag}

  return (
    <SelectedTagContext.Provider value={value}>
      {children}
    </SelectedTagContext.Provider>
  )
}
