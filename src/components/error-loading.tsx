import React from "react"
import { Shell } from "./shell"
import { ErrorCard } from "./error-card"

export default function ErrorLoading() {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="There was an error"
        description="Something went wrong. Please try again  later"
        retryLink="/"
        retryLinkText="Go to homepage"
      />
    </Shell>
  )
}
