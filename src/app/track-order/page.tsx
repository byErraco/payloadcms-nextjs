"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ZodError, z } from "zod"
import { toast } from "@/components/ui/use-toast"
import TrackCard from "./_component/track-card"
import { Shell } from "@/components/shell"
import { trpc } from "@/trpc/client"
import { Icons } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { Order } from "@/payload-types"
import { toast as toastsonner } from "sonner"

const FormSchema = z.object({
  orderNumber: z.string().min(2, {
    message: "Order number must be at least 2 characters.",
  }),
})
export default function TrackOrderPage() {
  // @ts-ignore
  const [orderData, setOrderData] = useState<Order>(null)
  const { mutate: getOrderDetails, isLoading } =
    trpc.getOrderDetails.useMutation({
      onError: (err) => {
        if (err?.data?.code === "NOT_FOUND") {
          toastsonner.error("Order not found")

          toast({
            title: "Order not found",
          })
          return
        }
        if (err instanceof ZodError) {
          toastsonner.error(err.issues[0].message)

          toast({ title: err.issues[0].message })
          return
        }
      },
      onSuccess: ({ foundOrder }) => {
        console.log("foundOrder", foundOrder)
        if (!foundOrder) {
          console.log("undefined")
          toastsonner.error("Order not found")
          toast({
            title: "Order not found",
          })
          return
        }
        setOrderData(foundOrder)
      },
    })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      orderNumber: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    getOrderDetails({ orderNumber: data.orderNumber })
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
    <Shell>
      <div className="w-full max-w-3xl mx-auto py-12 px-4 md:px-6 ">
        <div className="space-y-4 mb-12">
          <h1 className="text-3xl font-bold">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your order number below to check the status of your delivery.
          </p>
          <Form {...form}>
            <form
              className="flex items-center justify-center gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="orderNumber"
                render={({ field }) => (
                  <FormItem className="flex-1 justify-center items-center">
                    <FormLabel>Order Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your order number"
                        {...field}
                        className="flex-1"
                      />
                    </FormControl>
                    <FormDescription>
                      Fill out the form below to track your order.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                Track Order
                {isLoading && <Icons.spinner className="ml-2 animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
        {isLoading ? (
          <Skeleton className="h-7 w-full" />
        ) : (
          <TrackCard orderData={orderData} />
        )}
        {/* <div className="mt-12 border rounded-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-muted-foreground">Order Number</div>
              <div className="font-medium">Oe31b70H</div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-muted-foreground">Shipping Status</div>
              <div className="font-medium text-green-500">Delivered</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-muted-foreground">Estimated Delivery</div>
              <div className="font-medium">June 23, 2023</div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-muted-foreground">Tracking Number</div>
              <div className="font-medium">1Z999AA1234567890</div>
            </div>
          </div>
        </div> */}
      </div>
    </Shell>
  )
}
