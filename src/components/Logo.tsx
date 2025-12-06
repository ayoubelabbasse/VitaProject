'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  variant?: 'wordmark' | 'capsule' | 'badge'
  className?: string
  width?: number
  height?: number
  tone?: 'full' | 'mono'
  /** Optional scale multiplier to fine-tune rendered size */
  scale?: number
  /** Override responsive sizes descriptor for Next/Image */
  sizes?: string
}

const VARIANT_SIZES: Record<NonNullable<LogoProps['variant']>, { width: number; height: number }> = {
  wordmark: { width: 160, height: 48 },
  capsule: { width: 72, height: 72 },
  badge: { width: 72, height: 72 },
}

const DEFAULT_SIZES = '(max-width: 640px) 120px, (max-width: 1024px) 140px, 180px'

export default function Logo({
  variant = 'wordmark',
  className = '',
  width,
  height,
  tone = 'full',
  scale = 1,
  sizes = DEFAULT_SIZES,
}: LogoProps) {
  const fallback = VARIANT_SIZES[variant] || VARIANT_SIZES.wordmark
  const normalizedScale = typeof scale === 'number' && scale > 0 ? scale : 1
  const baseWidth = width ?? fallback.width
  const baseHeight = height ?? fallback.height
  const logoWidth = Math.round(baseWidth * normalizedScale)
  const logoHeight = Math.round(baseHeight * normalizedScale)

  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="TAQA Essentials">
      <Image
        src="/images/products/TAQA-Logo.png"
        alt="TAQA Essentials logo"
        width={logoWidth}
        height={logoHeight}
        sizes={sizes}
        priority={variant === 'wordmark'}
        className={`h-auto w-auto object-contain${tone === 'mono' ? ' grayscale' : ''}`}
      />
    </Link>
  )
}