import { getServerSideUser } from "@/lib/payload-utils"
import Cart from "../Cart"
import { ModeToggle } from "./mode-toggle"
import { UserNav } from "./user-nav"
import { cookies } from "next/headers"
import { Button } from "../ui/button"
import Link from "next/link"

interface NavbarProps {
  title: string
}

export async function Navbar({ title }: NavbarProps) {
  const nextCookies = cookies()
  const { user } = await getServerSideUser(nextCookies)
  // console.log("user", user)
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center container">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <Link href="/">
            <h1 className="font-bold">{title}</h1>
          </Link>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          {user ? (
            <UserNav user={user} />
          ) : (
            <Button asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
          <Cart />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
