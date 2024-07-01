"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"

// import { filterProducts } from "@/lib/actions/product"
function filterProducts({ query }: { query: string }) {
  return {
    data: [],
    error: false,
  }
}
import { cn, isMacOs } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { Kbd } from "@/components/kbd"
import { trpc } from "@/trpc/client"

// type ProductGroup = NonNullable<
//   Awaited<ReturnType<typeof filterProducts>>["data"]
// >[number]
type ProductGroup = any

const FALLBACK_LIMIT = 100

export function FflSearch({ form }: { form: any }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [data, setData] = React.useState<ProductGroup[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [selectedDealer, setSelectedDealer] = React.useState<any>(null)

  const {
    data: queryResults,
    fetchNextPage,
    refetch,
    isFetching,
  } = trpc.getDealers.useInfiniteQuery(
    {
      limit: FALLBACK_LIMIT,
      // limit: 4,
      name: debouncedQuery, // this is optional - remember
    },
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  const dealers = queryResults?.pages.flatMap((page) => page.items)

  // const { data: queryResults, isLoading } =
  // trpc.getDealers.useQuery(
  //   {
  //     limit:  FALLBACK_LIMIT,
  //     // limit: query.limit ?? FALLBACK_LIMIT,
  //     query:debouncedQuery,
  //   },
  // )

  React.useEffect(() => {
    // if (debouncedQuery.length <= 0) {
    //   setData(null)
    //   return
    // }

    async function fetchData() {
      refetch()
      // setLoading(true)
      // console.log("debouncedQuery", debouncedQuery)
      // const { data, error } = await filterProducts({ query: debouncedQuery })

      // if (error) {
      //   setLoading(false)
      //   return
      // }
      // setData(data)
      // setLoading(false)
    }

    void fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  // React.useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault()
  //       setOpen((open) => !open)
  //     }
  //   }
  //   window.addEventListener("keydown", handleKeyDown)
  //   return () => window.removeEventListener("keydown", handleKeyDown)
  // }, [])

  const onSelect = React.useCallback((callback: () => unknown) => {
    setOpen(false)
    callback()
  }, [])

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-medium">FFL Dealer Selected</span>
        <span className="font-medium">{selectedDealer?.name ?? "None"}</span>
      </div>

      <Button
        variant="outline"
        className="relative w-full size-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon className="size-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Search FFL dealer...</span>
        <span className="sr-only">Search FFL dealer</span>
        <Kbd
          title={isMacOs() ? "Command" : "Control"}
          className="pointer-events-none absolute right-1.5 top-1.5 hidden xl:block"
        >
          {isMacOs() ? "⌘" : "Ctrl"} K
        </Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          if (!open) {
            setQuery("")
          }
        }}
      >
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn(isFetching ? "hidden" : "py-6 text-center text-sm")}
          >
            No dealers found.
          </CommandEmpty>
          {isFetching ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            dealers?.map((item) => (
              <CommandItem
                key={item.id}
                className={cn(
                  form.getValues("fflDealerId") === item.id
                    ? "text-primary"
                    : "",
                  "h-9 cursor-pointer"
                )}
                value={item.name}
                onSelect={
                  () =>
                    onSelect(() => {
                      setSelectedDealer(item)
                      form.setValue("fflDealerId", item.id)
                    })
                  // onSelect(() => router.push(`/product/${item.id}`))
                }
              >
                <Icons.product
                  className="mr-2.5 size-3 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </CommandItem>
              // <CommandGroup
              //   //   @ts-ignore
              //   key={group.name}
              //   className="capitalize"
              //   //   @ts-ignore
              //   heading={group.name}
              // >
              //   {/*   @ts-ignore */}
              //   {group.products.map((item) => {
              //     return (
              //       <CommandItem
              //         key={item.id}
              //         className="h-9"
              //         value={item.name}
              //         onSelect={() =>
              //           onSelect(() => router.push(`/product/${item.id}`))
              //         }
              //       >
              //         <Icons.product
              //           className="mr-2.5 size-3 text-muted-foreground"
              //           aria-hidden="true"
              //         />
              //         <span className="truncate">{item.name}</span>
              //       </CommandItem>
              //     )
              //   })}
              // </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
