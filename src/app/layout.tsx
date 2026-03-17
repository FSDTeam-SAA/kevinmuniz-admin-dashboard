import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/providers/AuthProvider'
import QueryProvider from '@/components/providers/QueryProvider'
import { Toaster } from 'sonner'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Kevin Muniz Admin Dashboard',
  description: 'Admin dashboard for Kevin Muniz project',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
