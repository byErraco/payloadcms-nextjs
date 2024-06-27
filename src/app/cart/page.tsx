"use client"

import { Shell } from "@/components/shell"
import { Button } from "@/components/ui/button"
import { PRODUCT_CATEGORIES } from "@/config"
import useUser from "@/hooks/use-User"
import { useCart } from "@/hooks/use-cart"
import { cn, formatPrice } from "@/lib/utils"
import { trpc } from "@/trpc/client"
import { Check, Loader2, ShoppingCart, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {
  const { isFetching, data } = useUser()

  const { items, removeItem } = useCart()

  const router = useRouter()
  const [cartItems, setCartItems] = useState<any>([])

  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) router.push(url)
      },
    })

  const productIds = items.map(({ product }) => product.id)

  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  useEffect(() => {
    if (items.length > 0) {
      const cartItemsMap = items.map(({ product: item }: any) => {
        // console.log("item", item.images[0]?.image?.url)
        let price
        if (data?.subscription?.tier?.id)
          price = item.prices.find(
            (item: any) =>
              item.availableByTier?.id === data?.subscription?.tier?.id
          )?.price
        return {
          id: item.id,
          title: item.title,
          price: price || 500,
          // price: price || item.price,
          images: item.images,
          // images: item.images[0]?.image?.url,
          // image: item.images[0]?.url,
          quantity: 1,
        }
      })
      setCartItems(cartItemsMap)
    }
  }, [data, items])

  // @ts-ignore
  const cartTotal = cartItems.reduce((total, item) => total + item?.price, 0)
  // const cartTotal = items.reduce(
  //   (total, { product }) => total + product.price,
  //   0
  // )
  const fee = 1

  return (
    <Shell>
      {/* <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8"> */}
      <div className="flex flex-col min-h-screen">
        {/* <h1 className="text-3xl font-bold tracking-tight  sm:text-4xl">
          Shopping Cart
        </h1> */}
        <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
          <Link
            href="#"
            className="flex items-center gap-2 font-semibold text-lg"
            prefetch={false}
          >
            <ShoppingCart className="h-6 w-6" />
            <span>CART</span>
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

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                isMounted && items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src="/hippo-empty-cart.png"
                    fill
                    loading="eager"
                    alt="empty shopping cart hippo"
                  />
                </div>
                <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-gray-200 border-b border-t border-gray-200":
                  isMounted && items.length > 0,
              })}
            >
              {isMounted &&
                // items.map(({ product }) => {
                // @ts-ignore
                cartItems.map((item) => {
                  // const label = PRODUCT_CATEGORIES.find((c) =>
                  //   // @ts-ignore
                  //   product.categories.includes(c.value)
                  // )?.label

                  const { image } = item.images[0]

                  return (
                    <li key={item.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <div className="relative h-24 w-24">
                          {typeof image !== "string" && image.url ? (
                            <Image
                              fill
                              src={image.url}
                              alt="product image"
                              className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link
                                  href={`/product/${item.id}`}
                                  className="font-medium "
                                >
                                  {item.title}
                                </Link>
                              </h3>
                            </div>

                            {/* <div className="mt-1 flex text-sm">
                              <p className="text-muted-foreground">
                                Category: {label}
                              </p>
                            </div> */}

                            <p className="mt-1 text-sm font-medium ">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                            <div className="absolute right-0 top-0">
                              <Button
                                aria-label="remove product"
                                onClick={() => removeItem(item.id)}
                                variant="ghost"
                              >
                                <X className="h-5 w-5" aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 flex space-x-2 text-sm ">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500" />

                          <span>Eligible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  )
                })}
            </ul>
          </div>

          {/* <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"> */}
          <section className="mt-16 rounded-lg bg-muted px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            {/* <h2 className="text-lg font-medium ">Order summary</h2> */}
            <h2 className="text-2xl font-bold ">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm ">Subtotal</p>
                <p className="text-sm font-medium ">
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat Transaction Fee</span>
                </div>
                <div className="text-sm font-medium ">
                  {isMounted ? (
                    formatPrice(fee)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium ">Order Total</div>
                <div className="text-base font-medium ">
                  {isMounted ? (
                    formatPrice(cartTotal + fee)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                disabled={cartItems.length === 0 || isLoading}
                // @ts-ignore
                onClick={() => router.push("/checkout")}
                // onClick={() => createCheckoutSession({ productIds })}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : null}
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  )
}

export default Page
