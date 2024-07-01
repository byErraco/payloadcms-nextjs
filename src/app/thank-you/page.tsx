import { getServerSideUser } from "@/lib/payload-utils"
import Image from "next/image"
import { cookies } from "next/headers"
import { getPayloadClient } from "@/get-payload"
import { notFound, redirect } from "next/navigation"
import { Product, User } from "@/payload-types"
import { PRODUCT_CATEGORIES } from "@/config"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import PaymentStatus from "@/components/PaymentStatus"

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const ThankYouPage = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId
  const nextCookies = cookies()

  const { user } = await getServerSideUser(nextCookies)
  const payload = await getPayloadClient()

  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  })

  const [order] = orders

  if (!order) return notFound()

  // const orderUserId =
  //   // @ts-ignore
  //   typeof order.orderedBy === "string" ? order.orderedBy : order.orderedBy.id

  // if (orderUserId !== user?.id) {
  //   return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`)
  // }

  const products = order.products as Product[]

  const items = order.customerOrderDetails
  // @ts-ignore
  const orderTotal = products.reduce((total, product) => {
    return total + product.price
  }, 0)

  return (
    <main className="relative lg:min-h-full">
      {/* <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you-2.png"
          className="h-full w-full object-cover object-center"
          alt="thank you for your order"
        />
      </div> */}

      {/* <div> */}
      {/* <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24"> */}
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
        {/* <div className="lg:col-start-2"> */}
        <div className="lg:col-start-1">
          <p className="text-sm font-medium text-primary">Order successful</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight  sm:text-5xl">
            Thanks for ordering
          </h1>
          {order._isPaid ? (
            <p className="mt-2 text-base text-muted-foreground">
              Your order was processed. We&apos;ve sent your receipt and order
              details to{" "}
              {typeof order.orderedBy !== "string" ? (
                <span className="font-medium text-primary">
                  {/* @ts-ignore */}
                  {order.orderedBy.email}
                </span>
              ) : null}
              .
            </p>
          ) : (
            <p className="mt-2 text-base text-muted-foreground">
              We appreciate your order, and we&apos;re currently processing it.
              So hang tight and we&apos;ll send you confirmation very soon!
            </p>
          )}

          <div className="mt-16 text-sm font-medium">
            <div className="text-muted-foreground">Order nr.</div>
            <div className="mt-2 ">{order.id}</div>

            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
              {/* {(order.products as Product[]).map((product) => { */}
              {/* @ts-ignore */}
              {items?.products.map((product) => {
                // const label = PRODUCT_CATEGORIES.find(({ value }) =>
                //   product.categories?.includes(value)
                // )?.label

                const { image } = product.images[0]

                return (
                  <li key={product.id} className="flex space-x-6 py-6">
                    <div className="relative h-24 w-24">
                      {typeof image !== "string" && image.url ? (
                        <Image
                          fill
                          src={image.url}
                          alt={`${product.title} image`}
                          className="flex-none rounded-md bg-gray-100 object-cover object-center"
                        />
                      ) : null}
                    </div>

                    <div className="flex-auto flex flex-col justify-between">
                      <div className="space-y-1">
                        <h1 className="text-primary">{product.title}</h1>

                        {/* <p className="my-1">Category: {label}</p> */}
                      </div>

                      {/* {order._isPaid ? (
                            <a
                              href={downloadUrl}
                              download={product.name}
                              className='text-blue-600 hover:underline underline-offset-2'>
                              Download asset
                            </a>
                          ) : null} */}
                    </div>

                    <p className="flex-none font-medium ">
                      {formatPrice(product.price)}
                    </p>
                  </li>
                )
              })}
            </ul>

            <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
              <div className="flex justify-between">
                <p>Subtotal</p>
                {/* @ts-ignore */}
                <p className="">{formatPrice(order?.total)}</p>
              </div>

              <div className="flex justify-between">
                <p>Transaction Fee</p>
                <p className="">{formatPrice(1)}</p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6 ">
                <p className="text-base">Total</p>
                {/* @ts-ignore */}
                <p className="text-base">{formatPrice(order?.total + 1)}</p>
              </div>
            </div>

            <PaymentStatus
              isPaid={order._isPaid}
              orderEmail={(order.orderedBy as User)?.email}
              orderId={order.id}
            />

            <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <Link
                href="/products"
                className="text-sm font-medium text-primary hover:text-primary/90"
              >
                Continue shopping &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </main>
  )
}

export default ThankYouPage
