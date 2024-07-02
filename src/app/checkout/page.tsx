"use client"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/vpfhiSjs2Le
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Shell } from "@/components/shell"
import { CreditCard, Loader2 } from "lucide-react"
import CheckoutFormWrapper from "./_components/checkout-form-wrapper"
import { useEffect, useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"
import useUser from "@/hooks/use-User"
import { AlertDialogSigninCheckout } from "@/components/marketing/alert-signin-checkout"

export default function CheckoutPage() {
  const { items, removeItem } = useCart()
  const router = useRouter()
  const { isFetching, data } = useUser()
  const [cartItems, setCartItems] = useState<any>([])

  const productIds = items.map(({ product }) => product.id)

  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  useEffect(() => {
    if (!isFetching && !data) {
      setOpen(true)
    }
  }, [data, isFetching])
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

  const [open, setOpen] = useState(false)
  const onHandleRedirectLogin = () => {
    // router.push(`/sign-in?checkout=true`)
    setOpen(false)
  }
  const onHandleCancel = () => {
    router.push("/")
  }

  const fee = 1

  return (
    <Shell>
      <div className="flex flex-col min-h-screen">
        <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
          <Link
            href="#"
            className="flex items-center gap-2 font-semibold text-lg"
            prefetch={false}
          >
            <CreditCard className="h-6 w-6" />
            <span>SECURE CHECKOUT</span>
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
        {/* <main className="flex-1  "> */}
        {/* <main className="flex  gap-8 p-6 md:p-12"> */}
        <main className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-12"> */}
          {/* <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Shipping Address</Label>
              <Textarea
                id="address"
                placeholder="Enter your shipping address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment">Payment Information</Label>
              <Input id="payment" placeholder="Enter your payment details" />
            </div>
          </div> */}
          {/* <div className="w-1/2"> */}
          <div className="lg:col-span-7">
            <CheckoutFormWrapper />
          </div>
          {/* <div className="w-1/2 bg-muted p-6 rounded-lg space-y-6"> */}
          {/* <div className=" self-start sticky top-0 left-0 mt-16 rounded-lg bg-muted px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"> */}
          <div className=" mt-16 rounded-lg bg-muted px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                {/* <span>$99.99</span> */}
                {isMounted ? (
                  <span>{formatPrice(cartTotal)}</span>
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Flat Transaction Fee
                </span>
                {/* <span>$9.99</span> */}
                {isMounted ? (
                  <span>{formatPrice(fee)}</span>
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
                {/* <span>$109.98</span> */}
              </div>
            </div>
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                {isMounted &&
                  // @ts-ignore
                  cartItems.map((item) => {
                    return (
                      <div key={item.id} className="flex justify-between">
                        <span> {item.title}</span>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                    )
                  })}
              </div>
              <div className="text-sm bg-primary text-primary-foreground px-6 py-4">
                NOTICE: FEDEX AND UPS CANNOT CURRENTLY GUARANTEE EXPRESS
                DELIVERY! FEDEX AND UPS WILL NOT ISSUE REFUNDS FOR LATE
                DELIVERIES.
              </div>
              {/* <Button className="w-full">Place Order</Button> */}
            </div>
          </div>
        </main>
      </div>
      <AlertDialogSigninCheckout
        setOpen={setOpen}
        open={open}
        callback={onHandleRedirectLogin}
        onCancel={onHandleCancel}
      />
    </Shell>
  )
}

function Package2Icon(props: any) {
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}
