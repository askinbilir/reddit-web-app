import Navbar from '@/components/navbar'
import Providers from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reddit',
  description: 'Reddit Clone built with Next.js and TypeScript.'
}

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased min-h-screen pt-12 ${inter.className}`}>
        <Providers>
          <Navbar />

          {authModal}

          <div className='max-w-screen-2xl h-full mx-auto border border-primary/10'>
            <div className="container max-w-7xl mx-auto h-full pt-12 ">
              {children}
            </div>
          </div>

          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
