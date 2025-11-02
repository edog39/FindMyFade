import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'FindMyFade - Discover Your Perfect Barber',
  description: 'Find the best barbers near you, get AI-powered hairstyle recommendations, and book your perfect fade.',
  keywords: 'barber, haircut, fade, hairstyle, booking, nearby barbers',
  authors: [{ name: 'FindMyFade Team' }],
  openGraph: {
    title: 'FindMyFade - Discover Your Perfect Barber',
    description: 'Find the best barbers near you, get AI-powered hairstyle recommendations, and book your perfect fade.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white antialiased">
        <div className="relative min-h-screen">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.1),transparent)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(251,191,36,0.05),transparent)] pointer-events-none" />
          
          {/* Main content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
