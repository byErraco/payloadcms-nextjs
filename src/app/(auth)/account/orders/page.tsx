// "use client"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/6Zv7vdb1mJX
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import useUser from "@/hooks/use-User"
import { Skeleton } from "@/components/ui/skeleton"
import { cookies } from "next/headers"
import { getServerSideUser } from "@/lib/payload-utils"
import Link from "next/link"
import { getPayloadClient } from "@/get-payload"
import UserOrdersTable from "./order-table"

export default async function Component() {
  const nextCookies = cookies()
  const payload = await getPayloadClient()

  const { user: userSide } = await getServerSideUser(nextCookies)
  const { docs: users } = await payload.find({
    collection: "users",
    where: {
      id: userSide?.id,
    },
  } as any)

  const [user] = users
  //   const { data, isFetching } = useUser()
  //   console.log("data", data)
  //   if (isFetching)
  //     return (
  // <div className="bg-background p-6 rounded-lg shadow-sm">
  //   <div className="animate-pulse space-y-4">
  //     <div className="h-6 bg-muted rounded-md w-3/4" />
  //     <div className="h-8 bg-muted rounded-md w-1/2" />
  //     <div className="h-6 bg-muted rounded-md w-1/3" />
  //     <div className="h-10 bg-muted rounded-md" />
  //   </div>
  // </div>
  //     )
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
        <p className="mt-2 text-muted-foreground">
          Manage your active subscriptions and view your subscription history.
        </p>
      </div>
      <Separator />
      <section className="bg-muted/20 py-8 px-4 md:px-6 lg:py-12">
        <UserOrdersTable />
      </section>
    </div>
  )
}
