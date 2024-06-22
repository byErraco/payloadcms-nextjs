import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/account/sidebar"
import { Shell } from "@/components/shell"
import { getServerSideUser } from "@/lib/payload-utils"
import { cookies } from "next/headers"
import { router } from "@/trpc/trpc"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Account",
  description: "Ecommerce AWSH.",
}

const sidebarNavItems = [
  {
    title: "Account",
    href: "/account",
  },
  {
    title: "Subscription",
    href: "/account/subscription",
  },
  {
    title: "Orders",
    href: "/account/orders",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const nextCookies = cookies()
  const { user } = await getServerSideUser(nextCookies)
  if (!user) {
    redirect("/sign-in")
  }
  return (
    <Shell>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </Shell>
  )
}
