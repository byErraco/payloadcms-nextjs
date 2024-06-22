import Link from "next/link"

export default function CtaSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Unleash Your Firepower with Custom Weapons
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our collection of meticulously crafted custom weapons,
                designed to give you the edge in any battle. From
                precision-engineered rifles to devastating sidearms, we offer
                the ultimate in firepower and personalization.
              </p>
            </div>
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Explore Custom Weapons
            </Link>
          </div>
          <img
            src="/images/product-placeholder.webp"
            width="550"
            height="310"
            alt="Custom Weapons"
            className="mx-auto aspect-video overflow-hidden  object-cover object-center sm:w-full lg:order-last"
          />
        </div>
      </div>
    </section>
  )
}
