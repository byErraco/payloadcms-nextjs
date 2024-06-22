import clsx from "clsx"
import { Suspense } from "react"

// import { getCollections } from 'lib/shopify';
// import FilterList from './filter';
import { getPayloadClient } from "@/get-payload"
import FilterList from "./sortByFilter"

async function CategoriesList() {
  //   const collections = await getCollections();
  const payload = await getPayloadClient()
  const { docs: items } = await payload.find({
    collection: "categories",
  })

  // console.log("items", items)
  // @ts-ignore
  return <FilterList list={items} title="Collections" />
}

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded"
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300"
const items = "bg-neutral-400 dark:bg-neutral-700"

export default function Categories() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CategoriesList />
    </Suspense>
  )
}
