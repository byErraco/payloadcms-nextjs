/**
 * v0 by Vercel.
 * @see https://v0.dev/t/56FS9JgG2yw
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import Link from "next/link"
import Stripe from "stripe"
import { getServerSideUser } from "@/lib/payload-utils"
import Image from "next/image"
import { cookies } from "next/headers"
import { getPayloadClient } from "@/get-payload"
import { Shell } from "@/components/shell"
import { Button } from "@/components/ui/button"
import React from "react"
import { formatPrice } from "../../lib/utils"

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function Success({ searchParams }: PageProps) {
  const sessionId = searchParams.session_id
  const nextCookies = cookies()

  const { user } = await getServerSideUser(nextCookies)
  const payload = await getPayloadClient()

  const session = await stripe.checkout.sessions.retrieve(
    searchParams?.session_id as string
  )

  // @ts-ignore
  const totalPaid = session?.amount_total / 100
  const subscriptionId = session?.subscription
  const tierSubscriptionPrice = session?.metadata?.subscription

  const { docs: tiers } = await payload.find({
    collection: "tiers",
    where: {
      priceIdYearly: {
        equals: tierSubscriptionPrice,
      },
    },
  })

  const [tier] = tiers

  const jsonString = JSON.stringify(session, null, 2)
  // console.log("jsonString", jsonString)
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center  bg-muted/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold ">
              Payment Successful
            </h2>
            <p className="mt-2 text-center text-sm ">
              Thank you for your purchase!
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/success-tier.webp"
              width="300"
              height="300"
              alt="Payment Success"
              className="max-w-[300px]"
            />
          </div>
          <div>
            <Button className="w-full" asChild>
              <Link href="/dashboard">Continue to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-8">
          <div>
            <h3 className="text-lg font-medium ">Purchase Details</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium ">Plan</p>
              <p className="text-base font-medium ">{tier.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium ">Billing Frequency</p>
              <p className="text-base font-medium ">Yearly</p>
            </div>
            <div>
              <p className="text-sm font-medium ">Total Amount</p>
              <p className="text-base font-medium ">{formatPrice(totalPaid)}</p>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

function CheckIcon(props: any) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
