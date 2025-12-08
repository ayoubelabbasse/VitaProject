'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Star,
  Heart,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/formatters/currency'
import { getProductImage } from '@/utils/helpers/imagePlaceholder'
import { productCatalog } from '@/data/products'
import { normalizeProductImagePath } from '@/constants/paths'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [bundleProducts, setBundleProducts] = useState<Product[]>([])
  const [bundleSelectedIds, setBundleSelectedIds] = useState<string[]>([])
  const { addItem } = useCartStore()

  useEffect(() => {
    if (!productId) {
      setProduct(null)
      setLoading(false)
      return
    }
    
    // Fetch product from database
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/products/${productId}`)
        const data = await response.json()
        if (data.product) {
          setProduct(data.product)
        } else {
          // Fallback to static catalog (try both string and number ID)
          const numId = parseInt(productId)
          const foundProduct = productCatalog.find(p => p.id === productId || p.id === numId)
          setProduct(foundProduct || null)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        // Fallback to static catalog
        const numId = parseInt(productId)
        const foundProduct = productCatalog.find(p => p.id === productId || p.id === numId)
        setProduct(foundProduct || null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [productId])

  // Track recently viewed products in localStorage for homepage carousel
  useEffect(() => {
    if (!product) return
    if (typeof window === 'undefined') return

    try {
      const STORAGE_KEY = 'vita_recent_products'
      const raw = window.localStorage.getItem(STORAGE_KEY)
      let items: Product[] = []

      if (raw) {
        items = JSON.parse(raw)
      }

      // Remove existing entry for this product id, then add to front
      items = items.filter((p) => p.id !== product.id)
      items.unshift(product)

      // Limit to 12 items to keep storage small
      if (items.length > 12) {
        items = items.slice(0, 12)
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      // Fail silently if localStorage is unavailable
      console.warn('Failed to update recently viewed products', e)
    }
  }, [product])

  // Build "frequently purchased together" bundle (current product + top 2 related)
  useEffect(() => {
    if (!product) return
    const bundle: Product[] = [product, ...relatedProducts.filter((p) => p.id !== product.id).slice(0, 2)]
    setBundleProducts(bundle)
    setBundleSelectedIds(bundle.map((p) => String(p.id)))
  }, [product, relatedProducts])

  // Fetch related products
  useEffect(() => {
    if (product?.category) {
      const MAX_RELATED = 8
      fetch(`/api/products?category=${encodeURIComponent(product.category)}`)
        .then(res => res.json())
        .then(data => {
          if (data.products) {
            const related = data.products
              .filter((p: Product) => p.id !== product.id)
              .slice(0, MAX_RELATED)
            setRelatedProducts(related)
          }
        })
        .catch(() => {
          // Fallback to static catalog
          const related = productCatalog
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, MAX_RELATED)
          setRelatedProducts(related)
        })
    }
  }, [product])

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const defaultVariant = product.defaultVariantId
        ? product.variants.find((variant) => variant.id === product.defaultVariantId)
        : product.variants[0]
      setSelectedVariantId(defaultVariant ? defaultVariant.id : null)
    } else {
      setSelectedVariantId(null)
    }
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            <p className="text-muted text-sm">Loading product…</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text mb-4">Product Not Found</h1>
            <button
              onClick={() => router.push('/products')}
              className="btn-primary"
            >
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const variants = product.variants ?? []
  const selectedVariant = selectedVariantId
    ? variants.find((variant) => variant.id === selectedVariantId) ?? null
    : null
  const displayPrice = selectedVariant?.price ?? product.price
  const displayPackage = selectedVariant?.packageQuantity ?? product.packageQuantity
  const displayDosage = selectedVariant?.dosage ?? null
  const displayFlavor = selectedVariant?.flavor ?? (product.flavors?.[0] ?? null)

  const handleAddToCart = (e?: React.MouseEvent, options?: { openDrawer?: boolean }) => {
    e?.preventDefault()
    e?.stopPropagation()
    addItem(product, quantity, {
      variant: selectedVariant ?? undefined,
      openDrawer: options?.openDrawer,
    })
  }

  const gallerySources = (Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : Array.isArray(product.image)
      ? product.image
      : [product.image]
  )
    .map((img) => normalizeProductImagePath(img))
    .filter((img): img is string => Boolean(img))

  const productImages: string[] = gallerySources.length > 0 ? gallerySources : [getProductImage(product, 800, 800)]

  // Ensure we have at least 3 images for gallery (repeat if needed)
  const images: string[] =
    productImages.length >= 3
      ? productImages.slice(0, 3)
      : [
          ...productImages,
          ...Array(3 - productImages.length).fill(productImages[0] || getProductImage(product, 800, 800)),
        ]

  const toggleBundleSelection = (id: string) => {
    setBundleSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const bundleTotal = bundleProducts
    .filter((p) => bundleSelectedIds.includes(String(p.id)))
    .reduce((sum, p) => sum + (p.price ?? 0), 0)

  const handleAddBundleToCart = () => {
    bundleProducts
      .filter((p) => bundleSelectedIds.includes(String(p.id)))
      .forEach((p) => {
        addItem(p, 1, { variant: undefined, openDrawer: false })
      })
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-text hover:text-primary mb-6 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-10 mb-14">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gradient-to-br from-white via-white to-primary/10 border border-border rounded-2xl overflow-hidden shadow-soft p-6">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain mix-blend-multiply"
                priority
              />
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 p-3 bg-bg/90 backdrop-blur-sm border border-border rounded-lg hover:bg-bg transition-colors duration-200 shadow-soft focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted hover:text-primary'
                  }`}
                />
              </button>
              {!product.inStock && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-medium">
                  Out of Stock
                </div>
              )}
            </div>
            
            {/* Thumbnail Images - Small underneath */}
            <div className="flex gap-2 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 bg-gradient-to-br from-white via-white to-primary/10 rounded-xl overflow-hidden border transition-all duration-200 ${
                    selectedImage === idx
                      ? 'border-primary shadow-soft ring-2 ring-primary'
                      : 'border-border hover:border-primary/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-7">
            <div>
              <p className="text-primary font-medium text-sm mb-2">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-border'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-text">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center flex-wrap gap-3 mb-5">
                <span className="text-2xl font-bold text-text">
                  {formatPrice(displayPrice)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > displayPrice && (
                  <span className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
                    {Math.round(((product.originalPrice - displayPrice) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                {displayPackage && (
                  <span className="text-xs uppercase tracking-wide bg-border text-text px-2 py-1 rounded-full">
                    {displayPackage}
                  </span>
                )}
                {displayDosage && (
                  <span className="text-xs uppercase tracking-wide bg-border text-text px-2 py-1 rounded-full">
                    {displayDosage}
                  </span>
                )}
                {displayFlavor && (
                  <span className="text-xs uppercase tracking-wide bg-border text-text px-2 py-1 rounded-full">
                    {displayFlavor}
                  </span>
                )}
              </div>

              {variants.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-text mb-3">Choose your format</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {variants.map((variant) => {
                      const isActive = variant.id === selectedVariantId
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`text-left rounded-xl border px-4 py-3 transition-all duration-200 ${
                            isActive
                              ? 'border-primary bg-primary/5 shadow-soft'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-text leading-tight">
                              {variant.label}
                            </span>
                            <span className="text-sm font-semibold text-text">
                              {formatPrice(variant.price)}
                            </span>
                          </div>
                          <p className="text-xs text-muted mt-1">
                            {[variant.dosage, variant.packageQuantity, variant.flavor]
                              .filter(Boolean)
                              .join(' • ')}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-base text-muted mb-6 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold text-text mb-3">Key Benefits</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-border rounded-lg hover:border-primary hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-2xl font-bold text-text w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-border rounded-lg hover:border-primary hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={(e) => handleAddToCart(e)}
                disabled={!product.inStock}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-text hover:border-[#232526] hover:text-[#232526] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={(e) => {
                  handleAddToCart(e, { openDrawer: false });
                  router.push('/checkout');
                }}
                disabled={!product.inStock}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#232526] to-[#414345] px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-md hover:from-[#111827] hover:to-[#232526] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm font-medium text-text">Free Shipping</span>
                <span className="text-xs text-muted">Across Morocco</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm font-medium text-text">Secure Payment</span>
                <span className="text-xs text-muted">Protected</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm font-medium text-text">Easy Returns</span>
                <span className="text-xs text-muted">30 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently purchased together */}
        {bundleProducts.length > 1 && (
          <section className="mb-14">
            <div className="bg-white border border-border rounded-lg shadow-soft p-5 md:p-6">
              <h2 className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-text-muted mb-4">
                Frequently purchased together
              </h2>
              <div className="grid gap-6 md:grid-cols-[2fr,1.2fr] items-start">
                {/* Small product previews with plus signs */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    {bundleProducts.map((bp, index) => (
                      <div key={bp.id} className="flex flex-col items-center">
                        <div className="relative w-24 h-28 md:w-28 md:h-32 flex items-center justify-center">
                          <Image
                            src={getProductImage(bp)}
                            alt={bp.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="mt-3 text-xs text-center text-text max-w-[8rem] line-clamp-2">
                          {bp.name}
                        </p>
                        {index < bundleProducts.length - 1 && (
                          <span className="mt-3 text-2xl text-text-muted">
                            +
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selection + total */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    {bundleProducts.map((bp) => {
                      const id = String(bp.id)
                      const checked = bundleSelectedIds.includes(id)
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleBundleSelection(id)}
                          className="w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-3 py-2 text-left hover:border-[#232526] transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex h-4 w-4 items-center justify-center rounded-[4px] border text-[10px] ${
                                checked
                                  ? 'border-[#232526] bg-[#232526] text-white'
                                  : 'border-border bg-white text-transparent'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                            </span>
                            <span className="text-xs text-text line-clamp-2">
                              {bp.name}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-text">
                            {formatPrice(bp.price)}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold text-text">
                      Total
                    </span>
                    <span className="text-lg font-bold text-text">
                      {formatPrice(bundleTotal)}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={bundleSelectedIds.length === 0}
                    onClick={handleAddBundleToCart}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#232526] to-[#414345] px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-md hover:from-[#111827] hover:to-[#232526] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Add selected to cart</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Product Details Tabs */}
        <div className="bg-bg border border-border rounded-lg shadow-soft p-8 mb-16">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text mb-4">Ingredients</h2>
              <ul className="list-disc list-inside space-y-2 text-muted">
                {product.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text mb-4">Nutrition Facts</h2>
              <div className="bg-bg border border-border rounded-lg p-4">
                <p className="text-muted">Nutrition information coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-text mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

