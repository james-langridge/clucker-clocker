import {MainNav} from '@/components/main-nav'
import UserButton from '@/components/user-button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex h-14 items-center px-4 justify-between">
        <MainNav />
        <UserButton />
      </div>
    </header>
  )
}
