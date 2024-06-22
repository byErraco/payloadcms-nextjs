import { Shell } from "@/components/shell"
import { sorting } from "@/lib/constants"
import FilterList from "./_components/sortByFilter"
import Categories from "./_components/categories"

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Shell>
      <div className="mx-auto w-full flex max-w-screen-2xl flex-col gap-8 px-4 pb-4  md:flex-row ">
        <div className="hidden md:block">
          <div className="sticky top-24 space-y-6">
            <div className="order-first w-full flex-none md:max-w-[125px]">
              <Categories />
            </div>
          </div>
        </div>

        <div className="order-last min-h-screen w-full md:order-none">
          {children}
        </div>
        <div className="hidden md:block">
          <div className="sticky top-24 space-y-6">
            <div className="order-none flex-none md:order-last md:w-[125px]">
              <FilterList list={sorting} title="Sort by" />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
