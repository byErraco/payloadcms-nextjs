import { siteConfig } from "@/config/site"
import { AuthDropdown } from "@/components/layouts/auth-dropdown"
import { MainNav } from "@/components/layouts/main-nav"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { ProductsCombobox } from "@/components/products-combobox"
import Cart from "../Cart"
import CartSheet from "../checkout/cart-sheet"
import { User } from "@/payload-types"
import WordRotate from "../word-rotate"

interface SiteHeaderProps {
  user: User | null
}

export function SiteHeader({ user }: any) {
  // export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    // <div className="w-full sticky top-0 z-50">
    <div className="w-full">
      <div className="grid grid-cols-2 px-4 py-3 bg-primary text-primary-foreground gap-2">
        <div className="text-end text-sm font-medium">Active Promotions:</div>
        <div className="text-sm font-medium">
          {" "}
          <WordRotate words={["New", "Sale", "Limited"]} />
        </div>
      </div>
      {/* <div className=" px-4 py-3 bg-primary text-primary-foreground flex items-center justify-center">
        <p className="text-center text-sm font-medium">Active Promotions: </p>{" "}
        <WordRotate words={["New", "Sale", "Limited"]} />
      </div> */}

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <div className="container flex h-16 items-center">
          <MainNav items={siteConfig.mainNav} />
          <MobileNav items={siteConfig.mainNav} />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <ProductsCombobox />
              <CartSheet />
              <AuthDropdown user={user} />
            </nav>
          </div>
        </div>
      </header>
    </div>
  )
}
