import { redirect } from "next/navigation"

interface ProductPreviewPageProps {
  params: {
    productId: string
  }
}

export default function ProductPreviewPage({
  params,
}: ProductPreviewPageProps) {
  const productId = params.productId
  redirect(`/product/${productId}`)
}
