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
import { CheckItem } from "@/components/LandingPage/Pricing"
import { CheckCircle2 } from "lucide-react"
import ManageSubscriptionButton from "./_component/manage-subscription-button"

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
  // console.log("user", user)
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
        {/* @ts-ignore */}
        {user?.subscription ? (
          <div className="container mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">Your Active Subscription</h2>
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-lg font-medium">
                    {/* @ts-ignore */}
                    {user?.subscription?.tier?.title} Tier
                  </span>
                  <span className="text-muted-foreground">
                    {/* @ts-ignore */}
                    Started on {user?.subscription?.startDate}
                    {/* Renews on June 15, 2024 */}
                  </span>
                </div>
                <div className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
                  Active
                </div>
              </div>
              <p className="text-muted-foreground">
                Your current plan includes:
              </p>
              <div className="flex flex-col gap-2">
                {/* {JSON.stringify(user?.subscription?.tier?.features)} */}
                {/* @ts-ignore */}
                {user?.subscription?.tier?.features.map((item) => (
                  // <CheckItem key={feature} text={feature} />
                  <div className="flex gap-2" key={item.id}>
                    <CheckCircle2
                      size={18}
                      className="my-auto text-green-400"
                    />
                    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">
                      {item.feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              {/* @ts-ignore */}
              <ManageSubscriptionButton />
              {/* <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Manage
              </Link> */}
            </div>
          </div>
        ) : (
          <div className="container mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-2">
              You dont have any active subscriptions
            </div>
            <div className="flex justify-end">
              <Link
                href={"/tiers"}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Become a tier member
              </Link>
            </div>
          </div>
        )}
      </section>
      {/* <section className=" w-full">
        <div className="grid gap-8 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]">
          <div>
            <div className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pro Plan</CardTitle>
                  <CardDescription>Active</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <CalendarDaysIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Next Billing Date</p>
                      <p className="text-sm text-muted-foreground">
                        June 15, 2024
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Modify
                    </Button>
                  </div>
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-sm text-muted-foreground">$19.99/mo</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Starter Plan</CardTitle>
                  <CardDescription>Expired</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <CalendarDaysIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Expired On</p>
                      <p className="text-sm text-muted-foreground">
                        May 31, 2024
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Renew
                    </Button>
                  </div>
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-sm text-muted-foreground">$9.99/mo</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Upgrade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription History</CardTitle>
                <CardDescription>
                  View your past subscription details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <CalendarDaysIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Starter Plan</p>
                      <p className="text-sm text-muted-foreground">
                        Expired on May 31, 2024
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <CalendarDaysIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Pro Plan</p>
                      <p className="text-sm text-muted-foreground">
                        Active since June 1, 2023
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upgrade or Downgrade</CardTitle>
                <CardDescription>
                  Change your subscription plan to fit your needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Starter Plan</p>
                      <p className="text-sm text-muted-foreground">$9.99/mo</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Upgrade
                    </Button>
                  </div>
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Pro Plan</p>
                      <p className="text-sm text-muted-foreground">$19.99/mo</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Downgrade
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}
    </div>
  )
}

function CalendarDaysIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}

function DollarSignIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
