import React from "react"

export default function Loading() {
  return (
    <div className="bg-background p-6 rounded-lg shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-muted rounded-md w-3/4" />
        <div className="h-8 bg-muted rounded-md w-1/2" />
        <div className="h-6 bg-muted rounded-md w-1/3" />
        <div className="h-10 bg-muted rounded-md" />
      </div>
    </div>
  )
}
