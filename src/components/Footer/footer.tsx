import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-6 md:py-0 border-t border-border/40">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
          Built by{" "}
          <Link
            href="https://awsh.net"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            AWSH
          </Link>
        </p>
      </div>
    </footer>
  )
}
