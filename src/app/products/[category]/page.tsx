import { Metadata } from "next"
import { notFound } from "next/navigation"

import { defaultSort, sorting } from "@/lib/constants"
import { ProductCard } from "@/components/product-card"
import { getPayloadClient } from "@/get-payload"

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  console.log("CAAAAAAARL")
  console.log("params", params)
  console.log("params?.category", params?.category)
  const categories = params?.category?.split(" ")
  console.log("categories", categories)
  const { sort } = searchParams as { [key: string]: string }
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort
  let q = [params?.category]
  // let q = [{ slug: params?.category }]
  console.log("q", q)
  const payload = await getPayloadClient()
  const { docs: products } = await payload.find({
    collection: "products",

    where: {
      "categories.slug": {
        in: categories,
      },
      // categories: [params.category],
      // categories: {
      //   : [{ slug: params.category }],
      // },
    },
    //   where: {
    //     id: {
    //         equals: orderId,
    //     },
    // },
  })
  // con
  return (
    <section>
      {products.length > 0 ? (
        <div className=" grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
