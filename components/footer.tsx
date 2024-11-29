import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 dark:border-border md:px-8 md:py-0">
      <div className="container flex flex-col sm:items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance sm:text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{' '}
          <a
            href="https://github.com/james-langridge"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            james-langridge
          </a>
          . The source code is available on{' '}
          <a
            href="https://github.com/james-langridge/clucker-clocker"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
        <p className="text-balance sm:text-center text-sm leading-loose text-muted-foreground md:text-left">
          <Link href="/policy">Policy</Link>
        </p>
      </div>
    </footer>
  )
}
