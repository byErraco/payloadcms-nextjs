import { ProductCard } from "@/components/product-card"
import { getPayloadClient } from "@/get-payload"
import { defaultSort, sorting } from "@/lib/constants"

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string }
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort

  console.log("sort", sort)
  console.log("sortKey", sortKey)
  console.log("reverse", reverse)
  console.log("searchValue", searchValue)
  console.log(`${reverse ? "-" : ""}${sortKey}`)

  const payload = await getPayloadClient()
  const { docs: products } = await payload.find({
    collection: "products",
    sort: `${reverse ? "-" : ""}${sortKey}`,
  })

  // console.log("products", products)
  // const products = []
  // const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? "results" : "result"

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "There are no products that match "
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <div className=" grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : null}
    </>
  )
}
