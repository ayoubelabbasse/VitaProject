export const PRODUCT_IMAGE_FALLBACK = '/images/products/Hero-Image-taqa.png'

const PRODUCT_MEDIA_BY_SLUG: Record<string, string[]> = {
  'now-omega-3-fish-oil': ['/images/products/alive-omega3-nature.jpg'],
  'now-ultra-omega-3': ['/images/products/alive-omega3-nature.jpg'],
  'cgn-omega-3-premium': ['/images/products/alive-omega3-nature.jpg'],
  'natures-way-alive-hair-skin-nails': ['/images/products/alive-omega3-nature.jpg'],
  'now-vitamin-d3-k2': ['/images/products/Magnesium-and-lactobif-nature.jpg'],
  'life-extension-magnesium-caps': ['/images/products/Magnesium-and-lactobif-nature.jpg'],
  'now-magnesium-glycinate': ['/images/products/magnesium-nature.jpg'],
  'cgn-vitamin-d3-5000': [
    '/images/products/Magnesium-and-lactobif-nature.jpg',
    '/images/products/melatonin-nature.png',
  ],
  'now-zinc-50mg': ['/images/products/creatine-nature.jpg'],
  'now-iron-36mg': ['/images/products/creatine-nature.jpg'],
  '21st-century-potassium-gluconate': ['/images/products/creatine-nature.jpg'],
  'swanson-ashwagandha': ['/images/products/melatonin-nature.png'],
}

const PRODUCT_NAME_TO_SLUG: Record<string, string> = {
  'Omega-3 Fish Oil': 'now-omega-3-fish-oil',
  'Ultra Omega-3 Fish Oil': 'now-ultra-omega-3',
  'Omega-3 Premium Fish Oil': 'cgn-omega-3-premium',
  "Alive! Hair, Skin & Nails Gummies": 'natures-way-alive-hair-skin-nails',
  'Vitamin D3 & K2': 'now-vitamin-d3-k2',
  'Magnesium Caps 500 mg': 'life-extension-magnesium-caps',
  'Magnesium Glycinate': 'now-magnesium-glycinate',
  'Vitamin D3 5,000 IU': 'cgn-vitamin-d3-5000',
  'Zinc 50 mg': 'now-zinc-50mg',
  'Iron 36 mg': 'now-iron-36mg',
  'Potassium Gluconate 595 mg': '21st-century-potassium-gluconate',
  'Full Spectrum Ashwagandha': 'swanson-ashwagandha',
}

type ProductMedia = {
  primary: string
  gallery: string[]
}

const ensureArray = (gallery?: string[]): ProductMedia => {
  if (gallery && gallery.length > 0) {
    return { primary: gallery[0], gallery }
  }

  return { primary: PRODUCT_IMAGE_FALLBACK, gallery: [PRODUCT_IMAGE_FALLBACK] }
}

const LEGACY_IMAGE_REWRITES: Array<{ pattern: RegExp; replace: string }> = [
  { pattern: /^\/?assets\/hero\//i, replace: '/images/hero/' },
  { pattern: /^\/?images\/hero\//i, replace: '/images/hero/' },
]

export function normalizeProductImagePath(path?: string | null): string | undefined {
  if (!path) return undefined
  if (path.startsWith('data:')) return path

  let normalized = path.trim()

   // If the value looks like a bare image filename (e.g. "218.jpeg"),
   // assume it's one of the hero assets under /images/hero/
   if (
     !normalized.includes('/') &&
     /\.(jpe?g|png|webp|gif)$/i.test(normalized)
   ) {
     return `/images/hero/${normalized}`
   }

  // Leave remote URLs untouched
  if (/^[a-z]+:/i.test(normalized)) {
    return normalized
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }

  for (const rule of LEGACY_IMAGE_REWRITES) {
    if (rule.pattern.test(normalized)) {
      normalized = normalized.replace(rule.pattern, rule.replace)
      break
    }
  }

  return normalized
}

function getMediaFromSlug(slug?: string | number | null): ProductMedia {
  if (!slug) {
    return ensureArray()
  }

  const normalizedSlug = String(slug)
  return ensureArray(PRODUCT_MEDIA_BY_SLUG[normalizedSlug])
}

export function getProductMediaBySlug(slug?: string | number | null): ProductMedia {
  return getMediaFromSlug(slug)
}

export function getProductMediaByName(name?: string | null): ProductMedia {
  if (!name) {
    return ensureArray()
  }

  const slug = PRODUCT_NAME_TO_SLUG[name]
  return slug ? getMediaFromSlug(slug) : ensureArray()
}

type ResolveMediaOptions = {
  slug?: string | number | null
  name?: string | null
  fallbackImage?: string | null
  fallbackImages?: Array<string | null | undefined>
}

export function resolveProductMedia(options: ResolveMediaOptions = {}): ProductMedia {
  const curated = options.slug
    ? getProductMediaBySlug(options.slug)
    : getProductMediaByName(options.name)

  const hasCustomMedia =
    curated.primary !== PRODUCT_IMAGE_FALLBACK ||
    curated.gallery.some((entry) => entry !== PRODUCT_IMAGE_FALLBACK)

  if (hasCustomMedia) {
    return curated
  }

  const normalizedFallbacks = [options.fallbackImage, ...(options.fallbackImages ?? [])]
    .map((entry) => normalizeProductImagePath(entry))
    .filter((entry): entry is string => Boolean(entry))

  if (normalizedFallbacks.length > 0) {
    return ensureArray(normalizedFallbacks)
  }

  return curated
}

export function getProductMediaFields(slug: string | number): { image: string; images: string[] } {
  const media = resolveProductMedia({ slug })
  return {
    image: media.primary,
    images: media.gallery,
  }
}

