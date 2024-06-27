"use client"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/n6v3foFaTQb
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useCheckoutStore } from "@/hooks/use-checkout"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { trpc } from "@/trpc/client"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import { title } from "process"
import { toast } from "@/components/ui/use-toast"

const checkoutFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  phone: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  addressOne: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  addressTwo: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  city: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  state: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  country: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  zip: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  deliveryMethod: z.enum(["pickup", "delivery"]),
  specialInstructions: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  shippingMethod: z
    .string()
    .min(2, {
      message: "Please select a shipping method.",
    })
    .optional(),
  fflDealerId: z
    .string()
    .min(2, {
      message: "Please select a shipping method.",
    })
    .optional(),
  fflCertificate: z.any().optional(),
  termsAndConditions: z.boolean(),
})

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

// This can come from your database or API.
const defaultValues: Partial<CheckoutFormValues> = {}

export default function CheckoutFormWrapper() {
  const {
    address,
    contactInfo,
    deliveryMethod,
    fflDealerId,
    specialInstructions,
    shippingMethod,
    termsAndConditions,
    // @ts-ignore
    setCheckoutInfo,
  } = useCheckoutStore()

  const router = useRouter()
  const { items, removeItem, clearCart } = useCart()
  const productIds = items.map(({ product }) => product.id)

  const { mutate: createOrder, isLoading } =
    trpc.payment.createOrder.useMutation({
      // @ts-ignore
      onSuccess: ({ message, url }) => {
        toast({
          title: message,
        })
        clearCart()
        if (url) router.push(url)
      },
    })

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues,
    mode: "onChange",
  })
  const { formState } = form

  // console.log("formState", formState.errors)
  const currentDeliveryMethodValue = form.getValues("deliveryMethod")
  // console.log("currentDeliveryMethodValue", currentDeliveryMethodValue)

  const onError = () => {
    // @ts-ignore
    toast.error("Please fill out all required fields.")
  }

  const onValid = (data: CheckoutFormValues) => {
    // console.log("onValid")
    if (currentDeliveryMethodValue === "delivery") {
      const multipleValues = form.getValues([
        "addressOne",
        "city",
        "state",
        "zip",
        "country",
        "fflDealerId",
        "shippingMethod",
        "fflCertificate",
      ])
      // console.log("multipleValues", multipleValues)
      const hasErrors = multipleValues.some((item) => item === undefined)
      if (hasErrors) {
        // @ts-ignore
        toast.error("Please fill out all required fields.")
      }
    }
    console.log("data", data)
    console.log("productIds", productIds)
    // const orderDetails = {
    //   products: productIds,
    //   orderData: data,
    // }
    // console.log("orderData", orderData)
    createOrder({ products: productIds, orderDetails: data })
  }

  function onSubmit(data: CheckoutFormValues) {
    console.log("data", data)
    try {
    } catch (error) {
      console.log("error", error)
    }
    // console.log("data", data)
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
  }
  return (
    // <div className="w-full px-4 py-8 md:px-6 md:py-12">
    // <div className="w-full space-y-6">
    <Form {...form}>
      {/* <h1 className="mb-8 text-3xl font-bold">Checkout</h1> */}
      {/* <div className="space-y-6"> */}
      <form
        onSubmit={form.handleSubmit(onValid, onError)}
        className="space-y-6"
      >
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="w-full flex items-center justify-between rounded-lg bg-muted px-4 py-3 font-medium transition-colors hover:bg-muted/50">
            <span>Personal Information</span>
            <ChevronDownIcon className="h-5 w-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="rounded-lg border bg-background p-6 shadow-sm">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="w-full flex items-center justify-between rounded-lg bg-muted px-4 py-3 font-medium transition-colors hover:bg-muted/50">
            <span>Delivery or Pickup</span>
            <ChevronDownIcon className="h-5 w-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="rounded-lg border bg-background p-6 shadow-sm">
            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select delivery method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pickup" />
                        </FormControl>
                        <FormLabel className="font-normal">Pickup</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="delivery" />
                        </FormControl>
                        <FormLabel className="font-normal">Delivery</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CollapsibleContent>
        </Collapsible>

        {currentDeliveryMethodValue === "delivery" && (
          <>
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center justify-between rounded-lg bg-muted px-4 py-3 font-medium transition-colors hover:bg-muted/50">
                <span>Shipping Method</span>
                <ChevronDownIcon className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="rounded-lg border bg-background p-6 shadow-sm">
                <FormField
                  control={form.control}
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified shipping Method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FedEx">FedEx</SelectItem>
                          <SelectItem value="UPS">UPS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center justify-between rounded-lg bg-muted px-4 py-3 font-medium transition-colors hover:bg-muted/50">
                <span>Ship to Address</span>
                <ChevronDownIcon className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="rounded-lg border bg-background p-6 shadow-sm">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="addressOne"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address 1</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressTwo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address 2 (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter additional address details"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your city" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your state" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your zip code"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center justify-between rounded-lg bg-muted px-4 py-3 font-medium transition-colors hover:bg-muted/50">
                <span>FFL Dealer</span>
                <ChevronDownIcon className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="rounded-lg border bg-background p-6 shadow-sm">
                <FormField
                  control={form.control}
                  name="fflDealerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FFL Dealer</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified FFL Dealer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dealer1">Dealer 1</SelectItem>
                          <SelectItem value="dealer2">Dealer 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>
          </>
        )}

        {/* <div className="rounded-lg border bg-background p-6 shadow-sm">
          <div className="mb-4 grid gap-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Subtotal</span>
              <span>$99.99</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Shipping</span>
              <span>$9.99</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Tax</span>
              <span>$8.00</span>
            </div>
          </div>
          <Separator />
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">$117.98</span>
          </div>
          <div className="mt-4">
            <Label htmlFor="promo-code">Promo Code</Label>
            <div className="flex gap-2">
              <Input id="promo-code" placeholder="Enter promo code" />
              <Button>Apply</Button>
            </div>
          </div>
        </div> */}

        <FormField
          control={form.control}
          name="termsAndConditions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I AGREE TO THE TERMS AND CONDITIONS</FormLabel>
                <FormDescription>
                  <Link href="/terms-and-conditions">
                    {" "}
                    Click here to view store Terms and Conditions.
                  </Link>
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button">
            Back
          </Button>
          <Button type="submit">Place Order</Button>
        </div>
      </form>
    </Form>
  )
}

function ChevronDownIcon(props: any) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
