/**
 * Generate product placeholder images using SVG data URIs
 * Technical approach: Creates unique SVG placeholders based on product ID
 */

function generateSVGPlaceholder(productId: string | number, width: number = 720, height: number = 960): string {
  const seed =
    typeof productId === 'string'
      ? productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : productId;

  const hue = (seed * 137.508) % 360;
  const accentHue = (hue + 25) % 360;
  const bottleColor = `hsl(${hue}, 62%, 60%)`;
  const accentColor = `hsl(${accentHue}, 70%, 50%)`;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${bottleColor}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="${bottleColor}" stop-opacity="0.75"/>
        </linearGradient>
        <linearGradient id="capGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.75"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="rgba(35, 52, 37, 0.15)"/>
        </filter>
      </defs>
      <g filter="url(#shadow)" transform="translate(60,20)">
        <rect x="90" y="10" width="60" height="50" rx="12" fill="url(#capGradient)"/>
        <path d="M70 60 Q 65 100 65 140 L 65 300 Q 65 360 90 400 Q 115 440 180 440 Q 245 440 270 400 Q 295 360 295 300 L 295 140 Q 295 100 290 60 Z" fill="url(#bottleGradient)"/>
        <rect x="95" y="150" width="170" height="130" rx="28" fill="rgba(255, 255, 255, 0.82)"/>
        <rect x="115" y="165" width="130" height="55" rx="12" fill="${accentColor}" opacity="0.25"/>
        <rect x="115" y="230" width="130" height="35" rx="10" fill="${accentColor}" opacity="0.18"/>
        <path d="M120 340 Q 180 360 240 340" stroke="rgba(255,255,255,0.65)" stroke-width="8" stroke-linecap="round" fill="none"/>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Get product image - uses SVG placeholder if no image provided
 * Supports both single image string and array of images
 */
export function getProductImage(product: { id: string | number; image?: string | string[] | null }, width: number = 600, height: number = 600): string {
  if (!product.image) {
    return generateSVGPlaceholder(product.id, width, height);
  }
  
  // Handle array of images
  if (Array.isArray(product.image)) {
    const validImage = product.image.find(img => img && img.trim() !== '');
    return validImage || generateSVGPlaceholder(product.id, width, height);
  }
  
  // Handle string image
  if (typeof product.image === 'string' && product.image.trim() !== '') {
    return product.image;
  }
  
  return generateSVGPlaceholder(product.id, width, height);
}

