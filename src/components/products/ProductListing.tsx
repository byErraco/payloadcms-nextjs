"use client"

import { Product } from "@/payload-types"
import { useEffect, useState } from "react"
import Link from "next/link"
import { cn, formatPrice } from "@/lib/utils"
import { PRODUCT_CATEGORIES } from "@/config"
import ImageSlider from "./ImagesSlider"
import { Skeleton } from "../ui/skeleton"
import { EyeIcon } from "lucide-react"
import { buttonVariants } from "../ui/button"

interface ProductListingProps {
  product: Product | null
  index: number
}

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 75)

    return () => clearTimeout(timer)
  }, [index])

  if (!product || !isVisible) return <ProductPlaceholder />

  // @ts-ignore
  const categoriesLabels = product?.categories.map((c) => {
    // return c?.title
    // @ts-ignore
    return c?.title
  })

  // const label = PRODUCT_CATEGORIES.find(
  //   // @ts-ignore
  //   ({ value }) => {
  //     const categories = product.categories

  //   }
  //   // ({ value }) => value === product.category
  // )?.label

  // console.log("label", label)

  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[]

  if (isVisible && product) {
    return (
      <>
        <Link
          className={cn("invisible h-full w-full cursor-pointer group/main", {
            "visible animate-in fade-in-5": isVisible,
          })}
          href={`/product/${product.id}`}
        >
          <div className="flex flex-col w-full">
            <ImageSlider urls={validUrls} />

            <h3 className="mt-4 font-medium text-sm text-primary">
              {product.title}
            </h3>
            {categoriesLabels?.length &&
              categoriesLabels.map((c) => {
                return (
                  <span key={c} className="text-xs text-gray-500">
                    {c}
                  </span>
                )
              })}
            {/* <p className="mt-1 text-sm ">{label}</p> */}
            <p className="mt-1 font-medium text-sm ">
              {formatPrice(product.price)}
            </p>
          </div>
        </Link>
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
          <EyeIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">Preview</span>
        </Link>
      </>
    )
  }
}

const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  )
}

export default ProductListing
