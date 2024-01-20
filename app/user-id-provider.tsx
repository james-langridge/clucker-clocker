'use client'

import React, {useContext} from 'react'

interface UserIdContextType {
  userId: string | undefined
  setUserId: React.Dispatch<React.SetStateAction<string | undefined>>
}

const UserIdContext = React.createContext<UserIdContextType>({
  userId: '',
  setUserId: () => {},
})

export const useUserId = () => useContext(UserIdContext)

export default function UserIdProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [userId, setUserId] = React.useState<string | undefined>()

  const value = {userId, setUserId}

  return (
    <UserIdContext.Provider value={value}>{children}</UserIdContext.Provider>
  )
}
