"use client"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Swords } from "lucide-react"
import Link from "next/link"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import {
  AuthCredentialsValidator,
  LoginCredentialsValidator,
  TAuthCredentialsValidator,
  TLoginCredentialsValidator,
} from "@/lib/validators/account-credentials-validators"
import { trpc } from "@/trpc/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ZodError } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

function SignInPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const isNew = searchParams.get("new") === "true"
  const returnCheckout = searchParams.get("checkout") === "true"
  const origin = searchParams.get("origin")
  const priceId = searchParams.get("priceId")
  const subscription = searchParams.get("subscription") === "true"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginCredentialsValidator>({
    resolver: zodResolver(LoginCredentialsValidator),
  })

  const queryClient = useQueryClient()

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onError: (err) => {
      if (err?.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password")
        return
      }
      if (err instanceof ZodError) {
        toast.error(err.issues[0].message)
        return
      }
      toast.error("Something went wrong")
    },
    onSuccess: ({ success }) => {
      if (success) {
        queryClient.refetchQueries({ queryKey: ["user"] })

        toast.success("Signed in successfully")
        if (returnCheckout) {
          router.push("/checkout")
          router.refresh()
          return
        }
        if (origin) {
          router.push(`/${origin}`)
          router.refresh()
          return
        }
        if (priceId) {
          router.push(`/tiers?priceId=${priceId}&subscription=${subscription}`)
          router.refresh()
          return
        }
        router.push("/")
        router.refresh()
      }
    },
  })

  const onSubmit = ({ email, password }: TLoginCredentialsValidator) => {
    signIn({ email, password })
  }

  //   todo welcome message on new account
  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Swords className="h-20 w-20" />
          {/* <Icons.logo className='h-20 w-20' /> */}
          <h1 className="text-2xl font-semibold tracking-tight">
            Sigin in to your account
          </h1>

          <Link
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5",
            })}
            href="/sign-up"
          >
            Don&apos;t have an account? Sign-up
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  className={cn({
                    "focus-visible:ring-red-500": errors.email,
                  })}
                  placeholder="you@example.com"
                />
                {errors?.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-1 py-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password")}
                  type="password"
                  className={cn({
                    "focus-visible:ring-red-500": errors.password,
                  })}
                  placeholder="Password"
                />
                {errors?.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button>Sign in</Button>
            </div>
          </form>
          <div className="relative">
            <div
              aria-hidden="true"
              className="abosulute inset-0 flex items-center"
            >
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                <Link href="/tiers">Become a member</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
