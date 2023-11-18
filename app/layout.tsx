import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Clucker Clocker',
  description: 'Clock in, cluck out.',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col justify-between w-full h-full min-h-screen">
          <Header />
          <main className="flex items-center justify-center flex-auto w-full h-full max-w-3xl px-4 py-4 mx-auto sm:px-6 md:py-6">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
