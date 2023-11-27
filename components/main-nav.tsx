'use client'

import Image from 'next/image'
import React from 'react'

import {cn} from '@/lib/utils'

import CustomLink from './custom-link'
import {Button} from './ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu'

export function MainNav() {
  return (
    <div className="flex items-center space-x-2 lg:space-x-6">
      <CustomLink href="/">
        <Button variant="ghost" className="p-0">
          <Image src="/logo.png" alt="Home" width="32" height="32" />
        </Button>
      </CustomLink>
      <NavigationMenu>
        <NavigationMenuList>
          {/*<NavigationMenuItem>*/}
          {/*  <NavigationMenuLink*/}
          {/*    href="/help"*/}
          {/*    className={navigationMenuTriggerStyle()}*/}
          {/*  >*/}
          {/*    Help*/}
          {/*  </NavigationMenuLink>*/}
          {/*</NavigationMenuItem>*/}
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/log"
              className={navigationMenuTriggerStyle()}
            >
              Log
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/tags"
              className={navigationMenuTriggerStyle()}
            >
              Tags
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({className, title, children, ...props}, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
