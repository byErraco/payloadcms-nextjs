import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/Navbar/navbar"
import { Footer } from "@/components/Footer/footer"
import Providers from "@/components/Providers"
import { Toaster } from "sonner"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"
import { cookies } from "next/headers"
import { getServerSideUser } from "@/lib/payload-utils"
import { FloatingNav } from "@/components/floating-nav"
import { siteConfig } from "@/config/site"
import { Home, MessageCircle, User } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AWSHCommerce",
  description: "AWSHCommerce",
}

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  const nextCookies = cookies()
  const { user } = await getServerSideUser(nextCookies)

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <MessageCircle className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ]
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <FloatingNav navItems={navItems} />
            <SiteHeader user={user} />
            {/* <Navbar title={"AWSHCommerce"} /> */}
            <main className="min-h-[calc(100vh-57px-97px)] flex-1">
              {children}
              {modal}
            </main>
            {/* <Footer /> */}
            <SiteFooter />
          </Providers>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}
