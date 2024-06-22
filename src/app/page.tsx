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

function HomePage() {
  // return <PricingTiers />
  const {
    data: featuredProducts,
    isLoading,
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

  if (isLoading)
    return (
      <Shell className="max-w-6xl gap-0">
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
      </Shell>
    )

  if (error) return <div>Error: {error.message}</div>
  return (
    <Shell className="max-w-6xl gap-0">
      {/* <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"> */}
      {/* <PageHeader
        as="section"
        className="mx-auto items-center gap-2 text-center w-full"
        withPadding
      > */}
      <Billboard />
      {/* </PageHeader> */}
      {/* </section> */}
      <section
        className="grid animate-fade-up grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4"
        style={{ animationDelay: "0.50s", animationFillMode: "both" }}
      >
        {/* @ts-ignore */}
        {categories.map((category) => (
          <CategoryCard key={category.title} category={category} />
        ))}
      </section>
      <ContentSection
        title="Featured products"
        description="Explore products from around the world"
        href="/products"
        linkText="View all products"
        className="pt-14 md:pt-20 lg:pt-24"
      >
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ContentSection>
      <section className="py-12 md:py-24 lg:py-32">
        <PricingTiers />
      </section>
      <CtaSection />
    </Shell>
  )
}

export default HomePage
