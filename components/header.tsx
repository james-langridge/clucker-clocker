import {MainNav} from './main-nav'
import UserButton from './user-button'

export default function Header({userId}: {userId?: string}) {
  return (
    <header className="sticky flex justify-center border-b">
      <div className="flex items-center justify-between w-full h-16 max-w-3xl px-4 mx-auto sm:px-6">
        <MainNav userId={userId} />
        <UserButton />
      </div>
    </header>
  )
}
