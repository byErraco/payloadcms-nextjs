/**
 * v0 by Vercel.
 * @see https://v0.dev/t/qzj2aMAojLe
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div key="1" className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col items-center space-y-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex flex-col items-center space-y-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-1 w-full max-w-3xl" />
      </div>
      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-col">
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
