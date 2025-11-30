'use client'

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'product'
  width?: string | number
  height?: string | number
  className?: string
}

export default function Skeleton({ 
  variant = 'text', 
  width, 
  height, 
  className = '' 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-border rounded'
  
  const variantClasses = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: '',
    card: 'h-48',
    product: 'h-64',
  }

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-label="Loading"
    />
  )
}









