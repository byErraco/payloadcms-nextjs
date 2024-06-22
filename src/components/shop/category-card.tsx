import * as React from "react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { Category } from "@/payload-types"

// todo: use getProductCountByCategory && add slug to category collection
export function CategoryCard({ category }: any) {
  const productCountPromise = 10
  // const productCountPromise = getProductCountByCategory({
  //   categoryId: category.id,
  // })

  return (
    <Link href={`/collections/${category.id}`}>
      {/* <Link href={`/collections/${category.slug}`}> */}
      {/* <Card className="h-full rounded-lg transition-colors hover:bg-muted/25"> */}
      <Card className="h-full rounded-lg transition-colors hover:border-primary">
        <CardHeader className="flex-1">
          <CardTitle className="capitalize">{category?.title} </CardTitle>
          <CardDescription className="line-clamp-3 text-balance">
            {category?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <React.Suspense fallback={<Skeleton className="h-4 w-20" />}>
            {/* <ProductCount productCountPromise={productCountPromise} /> */}
            <ProductCount productCount={productCountPromise} />
          </React.Suspense>
        </CardContent>
      </Card>
    </Link>
  )
}

// async function ProductCount({ productCountPromise }: ProductCountProps) {
//   const count = await productCountPromise
async function ProductCount({ productCount }: any) {
  // const count = await productCountPromise

  return (
    <div className="flex w-fit items-center text-[0.8rem] text-muted-foreground">
      <Icons.product className="mr-1.5 size-3.5" aria-hidden="true" />
      {productCount} products
    </div>
  )
}
