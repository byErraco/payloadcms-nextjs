"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc/client"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { toast } from "sonner"
import { stripe } from "../../lib/stripe"
import { AlertDialogSignin } from "../marketing/alert-signin"
import { Skeleton } from "../ui/skeleton"

type PricingSwitchProps = {
  onSwitch: (value: string) => void
}

type PricingCardProps = {
  isYearly?: boolean
  title: string
  monthlyPrice?: number
  yearlyPrice?: number
  description: string
  features: string[]
  actionLabel: string
  popular?: boolean
  exclusive?: boolean
  onHandleCheckout: any
  priceIdMonthly: any
  priceIdYearly: any
}

const PricingHeader = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => (
  <section className="text-center">
    <h2 className="text-3xl font-bold">{title}</h2>
    <p className="text-xl pt-1">{subtitle}</p>
    <br />
  </section>
)

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="w-40 mx-auto" onValueChange={onSwitch}>
    <TabsList className="py-6 px-2">
      <TabsTrigger value="0" className="text-base">
        Monthly
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        Yearly
      </TabsTrigger>
    </TabsList>
  </Tabs>
)

const PricingCard = ({
  onHandleCheckout,
  id,
  isYearly,
  title,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
  priceIdMonthly,
  priceIdYearly,
  price,
}: // }: PricingCardProps) => (
any) => (
  <Card
    className={cn(
      `w-72 flex flex-col justify-between py-1 ${
        popular ? "border-rose-400" : "border-zinc-700"
      } mx-auto sm:mx-0`,
      {
        "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
          exclusive,
      }
    )}
  >
    <div>
      <CardHeader className="pb-8 pt-4">
        {/* {isYearly && yearlyPrice && monthlyPrice ? ( */}
        {popular ? (
          <div className="flex justify-between">
            <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
              {title}
            </CardTitle>
            {/* <div
              className={cn(
                "px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white",
                {
                  "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ":
                    popular,
                }
              )}
            >
              Save ${monthlyPrice * 12 - yearlyPrice}
            </div> */}
          </div>
        ) : (
          <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
            {title}
          </CardTitle>
        )}
        <div className="flex gap-0.5">
          <h3 className="text-3xl font-bold">
            ${price}
            {/* {yearlyPrice && isYearly
              ? "$" + yearlyPrice
              : monthlyPrice
              ? "$" + monthlyPrice
              : "Custom"} */}
          </h3>
          <span className="flex flex-col justify-end text-sm mb-1">
            /year
            {/* {yearlyPrice && isYearly ? "/year" : monthlyPrice ? "/month" : null} */}
          </span>
        </div>
        <CardDescription className="pt-1.5 h-12">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {features.map((feature: string) => (
          // @ts-ignore
          <CheckItem key={feature} text={feature.feature} />
        ))}
      </CardContent>
    </div>
    <CardFooter className="mt-2">
      <Button
        onClick={() =>
          onHandleCheckout(isYearly ? priceIdYearly : priceIdMonthly, true, id)
        }
        className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium  dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      >
        <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
        {actionLabel}
      </Button>
    </CardFooter>
  </Card>
)

export const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
)

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function PricingTiers() {
  const [isYearly, setIsYearly] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<any>({
    priceId: "",
    subscription: false,
  })
  const togglePricingPeriod = (value: string) =>
    setIsYearly(parseInt(value) === 1)

  const router = useRouter()
  const searchParams = useSearchParams()
  const priceId = searchParams.get("priceId")
  const subscription = searchParams.get("subscription") === "true"

  useEffect(() => {
    if (priceId && subscription) {
      toast.loading("Creating checkout session...")
      // @ts-ignore
      createCheckoutSession({ priceId, subscription })
    }
  }, [])

  const {
    mutate: createCheckoutSession,
    isLoading,
    error,
  } = trpc.payment.createMemberShipSession.useMutation({
    onSuccess: async ({ url, sessionId }: any) => {
      // if (url) router.push(url)
      if (sessionId) {
        const stripe = await stripePromise

        const response = await stripe?.redirectToCheckout({
          sessionId: sessionId,
        })

        return response
      }
    },
    onError: (err) => {
      if (err?.data?.code === "UNAUTHORIZED") {
        toast.error("Sign in to get started")
        setOpen(true)
        return
      }
      toast.error("Something went wrong")
    },
  })

  const onHandleCheckout = async (
    priceId: string,
    subscription: boolean,
    id: any
  ) => {
    setSelectedTier({ priceId, subscription, id })
    createCheckoutSession({ priceId, subscription, id })
  }
  const onHandleRedirectLogin = () => {
    router.push(
      `/sign-in?priceId=${selectedTier?.priceId}&subscription=${selectedTier?.subscription}`
    )
  }

  const {
    data: categories,
    isLoading: featuresLoading,
    error: categoriesError,
  } = trpc.getTiers.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  // const plans = [
  //   {
  //     title: "Basic",
  //     monthlyPrice: 10,
  //     yearlyPrice: 100,
  //     description: "Essential features you need to get started",
  //     features: [
  //       "Example Feature Number 1",
  //       "Example Feature Number 2",
  //       "Example Feature Number 3",
  //     ],
  //     priceIdMonthly: "price_1PQhwOINj6G1UXat3cV2Wp38",
  //     priceIdYearly: "price_1PQhwOINj6G1UXat3cV2Wp38",
  //     actionLabel: "Get Started",
  //   },
  //   {
  //     title: "Pro",
  //     monthlyPrice: 25,
  //     yearlyPrice: 250,
  //     description: "Perfect for owners of small & medium businessess",
  //     priceIdMonthly: "price_1PQhwOINj6G1UXat3cV2Wp38",
  //     priceIdYearly: "price_1PQhwOINj6G1UXat3cV2Wp38",
  //     features: [
  //       "Example Feature Number 1",
  //       "Example Feature Number 2",
  //       "Example Feature Number 3",
  //     ],
  //     actionLabel: "Get Started",
  //     popular: true,
  //   },
  //   {
  //     title: "Enterprise",
  //     price: "Custom",
  //     description: "Dedicated support and infrastructure to fit your needs",
  //     priceIdMonthly: "price_1PQhwOINj6G1UXat3cV2Wp38",
  //     priceIdYearly: "price_1PQhwOINj6G1UXat3cV2Wp38",
  //     features: [
  //       "Example Feature Number 1",
  //       "Example Feature Number 2",
  //       "Example Feature Number 3",
  //       "Super Exclusive Feature",
  //     ],
  //     actionLabel: "Contact Sales",
  //     exclusive: true,
  //   },
  // ]
  return (
    <div className="py-8">
      <PricingHeader
        title="Pricing Plans"
        subtitle="Choose the plan that's right for you"
      />
      {/* <PricingSwitch onSwitch={togglePricingPeriod} /> */}
      <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
        {featuresLoading ? (
          <>
            <Skeleton className="w-72 h-72 flex flex-col justify-between py-1 " />
            <Skeleton className="w-72 h-72 flex flex-col justify-between py-1 " />
            <Skeleton className="w-72 h-72 flex flex-col justify-between py-1 " />
          </>
        ) : (
          <>
            {/* @ts-ignore */}
            {categories.map((plan) => {
              return (
                <PricingCard
                  key={plan.title}
                  {...plan}
                  isYearly={isYearly}
                  onHandleCheckout={onHandleCheckout}
                />
              )
            })}
          </>
        )}
      </section>
      <AlertDialogSignin
        setOpen={setOpen}
        open={open}
        callback={onHandleRedirectLogin}
        onCancel={() => setOpen(!open)}
      />
    </div>
  )
}
