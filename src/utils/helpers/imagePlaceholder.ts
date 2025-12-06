/**
 * Image placeholder utilities
 * Generates SVG placeholders for products without images
 */
import { normalizeProductImagePath } from '@/constants/paths'

function generateSVGPlaceholder(productId: string | number, width: number = 720, height: number = 960): string {
  const id = String(productId)
  const colors = ['#11998E', '#38EF7D', '#1A8F5A', '#0D5C3A']
  const colorIndex = id.length % colors.length
  const primaryColor = colors[colorIndex]
  const secondaryColor = colors[(colorIndex + 1) % colors.length]

  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:0.05" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad-${id})"/>
  <circle cx="50%" cy="40%" r="15%" fill="${primaryColor}" opacity="0.1"/>
  <text x="50%" y="60%" font-family="Inter, sans-serif" font-size="24" fill="${primaryColor}" opacity="0.3" text-anchor="middle" font-weight="600">TAQA</text>
</svg>
`.trim()

  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Get product image - uses SVG placeholder if no image provided
 * Supports both single image string and array of images
 */
export function getProductImage(
  product: { id: string | number; image?: string | string[] | null },
  width: number = 600,
  height: number = 600,
): string {
  if (!product.image) {
    return generateSVGPlaceholder(product.id, width, height)
  }

  const fallback = generateSVGPlaceholder(product.id, width, height)

  const normalize = (value?: string | null) => normalizeProductImagePath(value) || value

  if (Array.isArray(product.image)) {
    const validImage = product.image.find((img) => img && img.trim() !== '')
    const normalized = normalize(validImage)
    return normalized || fallback
  }

  if (typeof product.image === 'string' && product.image.trim() !== '') {
    const normalized = normalize(product.image)
    return normalized || fallback
  }

  return fallback
}
