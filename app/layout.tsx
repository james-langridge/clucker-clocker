import type {Metadata} from 'next'
import {Inter} from 'next/font/google'

import Footer from '@/components/footer'
import Header from '@/components/header'
import {Toaster} from '@/components/ui/toaster'

import './globals.css'
import Providers from '@/app/Providers'
import {auth} from '@/auth'

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
  const session = await auth()

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col justify-between w-full h-full min-h-screen">
          <Providers>
            <Header userId={session?.user?.id} />
            <main className="flex flex-col items-center justify-evenly flex-auto w-full h-full px-4 py-4 mx-auto sm:px-6 md:py-6 relative">
              {children}
            </main>
          </Providers>
          <Toaster />
          <Footer />
        </div>
      </body>
    </html>
  )
}
