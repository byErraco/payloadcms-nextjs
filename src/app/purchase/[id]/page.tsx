import { Shell } from "@/components/shell"
import { getPayloadClient } from "@/get-payload"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import { CheckoutForm } from "./_component/purchase-form"
import { CreditCard } from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers"
import { getServerSideUser } from "@/lib/payload-utils"
// import { CheckoutForm } from "./_components/CheckoutForm"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string }
}) {
  const payload = await getPayloadClient()
  const { docs: orders } = await payload.find({
    collection: "orders",
    where: {
      id: {
        equals: id,
      },
    },
    depth: 2,
  })

  const [order] = orders
  const nextCookies = cookies()
  const { user } = await getServerSideUser(nextCookies)

  if (order == null) return notFound()

  const paymentIntent = await stripe.paymentIntents.create({
    // @ts-ignore
    amount: parseInt(order?.total) * 100,
    currency: "USD",
    // @ts-ignore
    metadata: { orderId: order.id, userId: user?.id },
  })

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent")
  }

  return (
    // <div>{JSON.stringify(order)}</div>
    <Shell>
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <Link
          href="#"
          className="flex items-center gap-2 font-semibold text-lg"
          prefetch={false}
        >
          <CreditCard className="h-6 w-6" />
          <span>Payment</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              <div className="h-2 w-2 rounded-full bg-primary-foreground opacity-50" />
              <div className="h-2 w-2 rounded-full bg-primary-foreground opacity-50" />
              <div className="h-2 w-2 rounded-full bg-primary-foreground opacity-50" />
            </div>
            <span className="text-sm">Step 2 of 4</span> */}
        </div>
      </header>
      <CheckoutForm order={order} clientSecret={paymentIntent.client_secret} />
    </Shell>
  )
}
