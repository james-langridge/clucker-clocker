import type {Metadata} from 'next'
import {Inter} from 'next/font/google'

import Providers from '@/app/providers'
import {Footer} from '@/components/footer'
import {Header} from '@/components/header'
import {Toaster} from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Clucker Clocker',
  description: 'Clock in, cluck out.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col justify-between sm:justify-evenly w-full h-full min-h-screen">
          <Header />
          <main className="flex flex-col items-center justify-between flex-auto w-full h-full px-3 py-4 mx-auto sm:px-6 md:py-6 relative">
            <Providers>{children}</Providers>
          </main>
          <Toaster />
          <Footer />
        </div>
      </body>
    </html>
  )
}
