import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { EnterFullScreenIcon } from "@radix-ui/react-icons"

import { cn, formatPrice } from "@/lib/utils"
import { AlertDialogAction } from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { buttonVariants } from "@/components/ui/button"
import { DialogShell } from "@/components/dialog-shell"
import { PlaceholderImage } from "@/components/placeholder-image"
import { getPayloadClient } from "@/get-payload"

interface ProductModalPageProps {
  params: {
    productId: string
  }
}

export default async function ProductModalPage({
  params,
}: ProductModalPageProps) {
  const productId = decodeURIComponent(params.productId)

  const payload = await getPayloadClient()
  const { docs: products } = await payload.find({
    collection: "products",
    limit: 1,
    where: {
      id: {
        equals: productId,
      },
      //   approvedForSale: {
      //     equals: "approved",
      //   },
    },
  })
  const [product] = products

  if (!product) {
    notFound()
  }

  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[]

  return (
    <DialogShell className="flex flex-col gap-2 overflow-visible sm:flex-row">
      <AlertDialogAction
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "icon",
            className:
              "absolute right-10 top-4 h-auto w-auto shrink-0 rounded-sm bg-transparent p-0 text-foreground opacity-70 ring-offset-background transition-opacity hover:bg-transparent hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
          })
        )}
        asChild
      >
        <Link href={`/product/${product.id}`} replace>
          <EnterFullScreenIcon className="size-4" aria-hidden="true" />
        </Link>
      </AlertDialogAction>
      <AspectRatio ratio={16 / 9} className="w-full">
        {product.images?.length ? (
          <Image
            src={validUrls[0] ?? "/images/product-placeholder.webp"}
            alt={product.title}
            className="object-cover"
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            fill
            loading="lazy"
          />
        ) : (
          <PlaceholderImage className="rounded-none" asChild />
        )}
      </AspectRatio>
      <div className="w-full space-y-6 p-6 sm:p-10">
        <div className="space-y-2">
          <h1 className="line-clamp-2 text-2xl font-bold">{product.title}</h1>
          <p className="text-base text-muted-foreground">
            {/* @ts-ignore */}
            {formatPrice(product.price)}
          </p>
          <p className="text-base text-muted-foreground">
            TODO ?? stock
            {/* {product?.inventory} in stock */}
          </p>
        </div>
        <p className="line-clamp-4 text-base text-muted-foreground">
          {product.description}
        </p>
      </div>
    </DialogShell>
  )
}
