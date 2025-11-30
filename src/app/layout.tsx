import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import I18nProvider from '@/components/I18nProvider'
import WhatsAppFloating from '@/components/WhatsAppFloating'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TAQA - Premium Supplements Morocco | Imported Vitamins & Health Products',
  description: 'Your trusted source for premium supplements and vitamins in Morocco. Imported from trusted global brands. Free shipping on orders over 300 MAD.',
  keywords: 'supplements, vitamins, Morocco, health, wellness, imported, protein, omega-3, vitamin D, fitness, nutrition',
  authors: [{ name: 'TAQA' }],
  openGraph: {
    title: 'TAQA - Premium Supplements Morocco',
    description: 'Your trusted source for premium supplements and vitamins in Morocco',
    type: 'website',
    locale: 'en_US',
    siteName: 'TAQA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAQA - Premium Supplements Morocco',
    description: 'Your trusted source for premium supplements and vitamins in Morocco',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/assets/brand/vita_logo_capsule_leaf.svg',
    shortcut: '/assets/brand/vita_logo_capsule_leaf.svg',
    apple: '/assets/brand/vita_logo_capsule_leaf.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" style={{ direction: 'ltr' }} suppressHydrationWarning>
      <body className={`${inter.className} font-sans`} dir="ltr" style={{ direction: 'ltr' }} suppressHydrationWarning>
        <I18nProvider>
          <div className="min-h-screen bg-bg">
            {children}
            <WhatsAppFloating />
          </div>
        </I18nProvider>
      </body>
    </html>
  )
} 