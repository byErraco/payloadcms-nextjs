"use client"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { trpc } from "@/trpc/client"
import { useQueryClient } from "@tanstack/react-query"
import React from "react"
import { ZodError } from "zod"

export default function ManageSubscriptionButton({
  stripeCustomerID,
}: {
  stripeCustomerID: string
}) {
  const queryClient = useQueryClient()

  const { mutate: createCustomerPortal, isLoading } =
    trpc.auth.createStripeCustomerPortal.useMutation({
      onError: (err) => {
        if (err?.data?.code === "UNAUTHORIZED") {
          toast({ title: "Invalid request" })
          return
        }
        if (err instanceof ZodError) {
          toast({
            title: err.issues[0].message,
          })
          return
        }
        toast({ title: "Something went wrong" })
      },
      onSuccess: ({ success, url }: any) => {
        if (success) {
          window.location.href = url
          //   queryClient.refetchQueries({ queryKey: ["user"] })

          toast({
            title:
              "You will be redirected to your Stripe account in a few seconds",
          })
        }
      },
    })
  return (
    <Button
      onClick={() => createCustomerPortal()}
      //   onClick={() => createCustomerPortal({ stripeCustomerID })}
      disabled={isLoading}
    >
      Manage Subscription
    </Button>
  )
}
