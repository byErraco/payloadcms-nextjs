"use client"
import PricingTiers from "@/components/LandingPage/Pricing"
import { ContentSection } from "@/components/content-section"
import { ProductCard } from "@/components/product-card"
import ProductReel from "@/components/products/ProductReel"
import { Shell } from "@/components/shell"
import { trpc } from "@/trpc/client"
import React from "react"
import Categories from "../collections/Categories"
import { CategoryCard } from "@/components/shop/category-card"
import Billboard from "@/components/marketing/billboard"
import { PageHeader } from "@/components/page-header"
import CtaSection from "@/components/marketing/cta-section"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryCardV2 } from "@/components/shop/category-card-v2"
import Hero from "@/components/shop/hero-three"
import { InfoSection } from "@/components/shop/info-section"
import { TracingBeam } from "@/components/tracing-beam"
import { ProductCarousel } from "@/components/product-carousel"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import Marquee from "@/components/marquee"
import { cn } from "@/lib/utils"

function HomePage() {
  // return <PricingTiers />
  const {
    data: featuredProducts,
    isLoading: featuredProductsLoading,
    error,
  } = trpc.getFeaturedProducts.useQuery(
    {
      limit: 10,
    },
    {
      refetchOnWindowFocus: false,
    }
  )

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = trpc.getCategories.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  const reviews = [
    {
      name: "Jack",
      username: "@jack",
      body: "I've never seen anything like this before. It's amazing. I love it.",
      img: "https://avatar.vercel.sh/jack",
    },
    {
      name: "Jill",
      username: "@jill",
      body: "I don't know what to say. I'm speechless. This is amazing.",
      img: "https://avatar.vercel.sh/jill",
    },
    {
      name: "John",
      username: "@john",
      body: "I'm at a loss for words. This is amazing. I love it.",
      img: "https://avatar.vercel.sh/john",
    },
    {
      name: "Jane",
      username: "@jane",
      body: "I'm at a loss for words. This is amazing. I love it.",
      img: "https://avatar.vercel.sh/jane",
    },
    {
      name: "Jenny",
      username: "@jenny",
      body: "I'm at a loss for words. This is amazing. I love it.",
      img: "https://avatar.vercel.sh/jenny",
    },
    {
      name: "James",
      username: "@james",
      body: "I'm at a loss for words. This is amazing. I love it.",
      img: "https://avatar.vercel.sh/james",
    },
  ]

  const firstRow = reviews.slice(0, reviews.length / 2)
  const secondRow = reviews.slice(reviews.length / 2)
  // if (featuredProductsLoading)
  //   return (
  //     <Shell className="max-w-6xl gap-0">
  //       <Skeleton className="w-[100px] h-[20px] rounded-full" />
  //     </Shell>
  //   )

  if (error) return <div>Error: {error.message}</div>
  return (
    // <TracingBeam className="px-6">
    <Shell className="max-w-6xl gap-0">
      <TracingBeam className="">
        <Hero />
        {/* <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"> */}
        {/* <PageHeader
        as="section"
        className="mx-auto items-center gap-2 text-center w-full"
        withPadding
      > */}
        <Billboard />
        {/* </PageHeader> */}
        {/* </section> */}
        {/* <section
        className="grid animate-fade-up grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4"
        style={{ animationDelay: "0.50s", animationFillMode: "both" }}
      >
        {categories.map((category) => (
          <CategoryCard key={category.title} category={category} />
        ))}
      </section> */}
        <ContentSection
          title="Featured products"
          description="Explore products from around the world"
          href="/products"
          linkText="View all products"
          className="pt-14 md:pt-20 lg:pt-24"
        >
          {featuredProductsLoading ? (
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          ) : (
            <>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </>
          )}
        </ContentSection>

        <section
          className=" pt-14 grid animate-fade-up grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4"
          style={{ animationDelay: "0.50s", animationFillMode: "both" }}
        >
          {categoriesLoading ? (
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          ) : (
            <>
              {/* @ts-ignore */}
              {categories.map((category) => (
                <CategoryCardV2 key={category.title} category={category} />
              ))}
            </>
          )}
        </section>

        <section className="pt-14 md:pt-20 lg:pt-24 space-y-6">
          <PricingTiers />
        </section>

        <section
          className=" py-12 md:py-24 lg:py-32   animate-fade-up  "
          style={{ animationDelay: "0.50s", animationFillMode: "both" }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex max-w-[61.25rem] flex-1 flex-col gap-0.5">
              <h2 className="text-2xl font-bold leading-[1.1] md:text-3xl">
                New Products
              </h2>

              <p className="max-w-[46.875rem] text-balance text-sm leading-normal text-muted-foreground sm:text-base sm:leading-7">
                Explore the best and new tactical products
              </p>
            </div>
            <Button variant="outlined" className="hidden sm:flex" asChild>
              <Link href={"/products"}>
                View More
                <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
                <span className="sr-only"> View More</span>
              </Link>
            </Button>
          </div>
          <div className="space-y-8">
            <section className="mt-6">
              <ProductCarousel />
            </section>
          </div>
        </section>
        <InfoSection />
        {/* <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background py-20 md:shadow-xl"> */}
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background py-20 md:shadow-xl">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
        {/* <CtaSection /> */}
      </TracingBeam>
    </Shell>
  )
}

export default HomePage

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        // "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "relative w-64 cursor-pointer overflow-hidden border p-4",
        // light styles
        // "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] hover:border-primary",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] dark:hover:border-primary"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}
