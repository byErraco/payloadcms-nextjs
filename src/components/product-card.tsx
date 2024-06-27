"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckIcon, EyeOpenIcon, PlusIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

import { cn, formatPrice } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { PlaceholderImage } from "@/components/placeholder-image"
import { Product } from "@/payload-types"
import { useCart } from "@/hooks/use-cart"
import { Badge } from "./ui/badge"

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
  variant?: "default" | "switchable"
  isAddedToCart?: boolean
  onSwitch?: () => Promise<void>
}

export function ProductCard({
  product,
  variant = "default",
  isAddedToCart = false,
  onSwitch,
  className,
  ...props
}: ProductCardProps) {
  // console.log("product", product.prices[0])
  const [isUpdatePending, startUpdateTransition] = React.useTransition()
  const { addItem } = useCart()

  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[]

  return (
    <Card
      className={cn(
        "size-full overflow-hidden rounded-lg hover:border-primary",
        className
      )}
      {...props}
    >
      <Link aria-label={product.title} href={`/product/${product.id}`}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            {product.images?.length ? (
              <Image
                src={
                  validUrls[0] ?? "/images/product-placeholder.webp"
                  //   product.images[0]?.url ?? "/images/product-placeholder.webp"
                }
                alt={product.title}
                className="object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                fill
                loading="lazy"
              />
            ) : (
              <PlaceholderImage className="rounded-none" asChild />
            )}
          </AspectRatio>
        </CardHeader>
        <span className="sr-only">{product.title}</span>
      </Link>
      <Link href={`/product/${product.id}`} tabIndex={-1}>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="line-clamp-1">{product.title}</CardTitle>
          <CardDescription className="flex flex-col gap-1">
            {/* <CardDescription className="line-clamp-1"> */}
            {/* {formatPrice(product.price)} */}
            {product.prices?.length &&
              product.prices.map((p, index) => (
                <div key={index}>
                  {formatPrice(p.price)}{" "}
                  <Badge variant="outline">
                    {/* @ts-ignore */}
                    {p.availableByTier?.description}
                  </Badge>
                  {/* <span>{p.availableByTier?.description}</span> */}
                </div>
              ))}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-1">
        {variant === "default" ? (
          <div className="flex w-full items-center space-x-2">
            <Button
              aria-label="Add to cart"
              size="sm"
              className="h-8 w-full rounded-sm"
              onClick={async () => {
                startUpdateTransition(() => {})
                addItem(product)
              }}
              disabled={isUpdatePending}
            >
              {isUpdatePending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Add to cart
            </Button>
            <Link
              href={`/preview/product/${product.id}`}
              title="Preview"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "icon",
                  className: "h-8 w-8 shrink-0",
                })
              )}
            >
              <EyeOpenIcon className="size-4" aria-hidden="true" />
              <span className="sr-only">Preview</span>
            </Link>
          </div>
        ) : (
          <Button
            aria-label={isAddedToCart ? "Remove from cart" : "Add to cart"}
            size="sm"
            className="h-8 w-full rounded-sm"
            onClick={async () => {
              startUpdateTransition(async () => {})
              await onSwitch?.()
            }}
            disabled={isUpdatePending}
          >
            {isUpdatePending ? (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            ) : isAddedToCart ? (
              <CheckIcon className="mr-2 size-4" aria-hidden="true" />
            ) : (
              <PlusIcon className="mr-2 size-4" aria-hidden="true" />
            )}
            {isAddedToCart ? "Added" : "Add to cart"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
