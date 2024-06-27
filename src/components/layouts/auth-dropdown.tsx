import * as React from "react"
import Link from "next/link"
import { DashboardIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons"

import { cn, getUserEmail } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { User } from "@/payload-types"
import LogoutButton from "./logout-button"

interface AuthDropdownProps
  extends React.ComponentPropsWithRef<typeof DropdownMenuTrigger>,
    ButtonProps {
  user: User | null
}

export async function AuthDropdown({
  user,
  className,
  ...props
}: AuthDropdownProps) {
  if (!user) {
    return (
      <Button size="sm" className={cn(className)} {...props} asChild>
        <Link href="/sign-in">
          Sign In
          <span className="sr-only">Sign In</span>
        </Link>
      </Button>
    )
  }

  const initials = `${user.name?.charAt(0) ?? ""}`

  //   const initials = `${user.firstName?.charAt(0) ?? ""} ${
  //     user.lastName?.charAt(0) ?? ""
  //   }`
  const email = getUserEmail(user)

  //   const storePromise = getStoreByUserId({ userId: user.id })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <Button
          variant="secondary"
          className={cn("size-8 rounded-full", className)}
          {...props}
        > */}
        <Avatar className="size-8 cursor-pointer">
          {/* @ts-ignore */}
          <AvatarImage src={user?.name} alt={user?.name ?? ""} />
          {/* <AvatarImage src={user.imageUrl} alt={user.username ?? ""} /> */}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {/* </Button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {/* {user.firstName} {user.lastName} */}
              {user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <React.Suspense
          fallback={
            <div className="flex flex-col space-y-1.5 p-1">
              {Array.from({ length: 1 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-sm" />
              ))}
            </div>
          }
        >
          <AuthDropdownGroup />
        </React.Suspense>
        <DropdownMenuSeparator />
        <LogoutButton />
        {/* <DropdownMenuItem asChild>
          <Link href="/signout">
            <ExitIcon className="mr-2 size-4" aria-hidden="true" />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

async function AuthDropdownGroup() {
  return (
    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link href={"/account"}>
          <DashboardIcon className="mr-2 size-4" aria-hidden="true" />
          Account
          <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  )
}
