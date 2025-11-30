'use client'

import Link from 'next/link'

interface LogoProps {
  variant?: 'wordmark' | 'capsule' | 'badge'
  tone?: 'brand' | 'mono'
  className?: string
  width?: number
  height?: number
}

export default function Logo({ variant = 'wordmark', tone = 'brand', className = '', width, height }: LogoProps) {
  const defaultSize = variant === 'wordmark' ? { width: 120, height: 32 } : { width: 40, height: 40 }
  const logoWidth = width || defaultSize.width
  const logoHeight = height || defaultSize.height
  const isMono = tone === 'mono'
  const primaryFill = isMono ? '#1F2937' : '#11998E'
  const accentFill = isMono ? '#4B5563' : '#38EF7D'
  const textColorClass = isMono ? 'text-text' : 'text-primary'

  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="TAQA - Premium Supplements">
      <div className="flex items-center gap-0">
        {/* V Icon */}
        <div className="relative flex-shrink-0" style={{ width: logoHeight, height: logoHeight }}>
          <svg
            width={logoHeight}
            height={logoHeight}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 hover:scale-105"
            style={{ width: '100%', height: '100%' }}
          >
            <path
              d="M16 4 L24 28 L20 28 L16 12 L12 28 L8 28 Z"
              fill={primaryFill}
              className={isMono ? undefined : 'transition-colors duration-300'}
            />
            <circle cx="16" cy="8" r="2" fill={accentFill} />
          </svg>
        </div>

        {/* TAQA Brand Logo with Decorative Elements */}
        <span className="relative inline-block ml-0 flex-shrink-0">
          <span className={`text-2xl font-extrabold leading-none tracking-tight ${textColorClass}`} style={{ fontFamily: 'Inter, system-ui', direction: 'ltr', fontSize: '1.5rem', lineHeight: '1' }}>
            <span className="relative z-10">TA</span>
            <span className="relative z-10 inline-block mx-0.5">
              <span className="relative">
                <span>Q</span>
                {/* Decorative accent on Q */}
                <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 ${isMono ? 'bg-gray-500' : 'bg-gradient-to-br from-[#11998E] to-[#38EF7D]'} rounded-full opacity-60`}></span>
              </span>
            </span>
            <span className="relative z-10">A</span>
          </span>
          {/* Decorative underline */}
          <span className={`absolute -bottom-0.5 left-0 right-0 h-0.5 ${isMono ? 'bg-gray-400' : 'bg-gradient-to-r from-[#11998E] to-[#38EF7D]'} opacity-40`} style={{ background: isMono ? 'linear-gradient(to right, transparent, currentColor, transparent)' : 'linear-gradient(to right, transparent, #11998E, #38EF7D, transparent)' }}></span>
          {/* Small decorative dots */}
          <span className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 ${isMono ? 'bg-gray-400' : 'bg-gradient-to-br from-[#11998E] to-[#38EF7D]'} rounded-full opacity-50`}></span>
          <span className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 ${isMono ? 'bg-gray-400' : 'bg-gradient-to-br from-[#11998E] to-[#38EF7D]'} rounded-full opacity-50`}></span>
        </span>
      </div>
    </Link>
  )
}