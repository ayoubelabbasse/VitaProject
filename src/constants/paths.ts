/**
 * Centralized path constants for images and assets
 * Makes it easy to update paths if folder structure changes
 */

export const IMAGE_PATHS = {
  hero: {
    products: '/images/hero/imagesProducts.png',
    front: '/images/hero/front.jpg',
    homepage: '/images/hero/homepage-Subheader-Section.png',
  },
  products: {
    base: '/images/products/',
  },
  brand: {
    base: '/images/brand/',
    capsule: '/images/brand/vita_logo_capsule_leaf.svg',
    badge: '/images/brand/vita_logo_badge.svg',
    wordmark: '/images/brand/vita_logo_wordmark.svg',
  },
  common: {
    base: '/images/common/',
  },
} as const;

/**
 * Helper to get product image path
 */
export function getProductImagePath(imageName: string): string {
  return `${IMAGE_PATHS.products.base}${imageName}`;
}

