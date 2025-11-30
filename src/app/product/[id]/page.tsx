'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, Check, Truck, Shield, RotateCcw, Minus, Plus, ArrowLeft, ArrowRight, Plus as PlusIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/currency'
import { getProductImage } from '@/utils/imagePlaceholder'
import { productCatalog } from '@/data/products'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const { addItem } = useCartStore()

  useEffect(() => {
    if (!productId) {
      setProduct(null)
      return
    }
    
    // Fetch product from database
    const fetchProduct = async () => {
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
      }
    }
    
    fetchProduct()
  }, [productId])

  // Fetch related products
  useEffect(() => {
    if (product?.category) {
      fetch(`/api/products?category=${encodeURIComponent(product.category)}`)
        .then(res => res.json())
        .then(data => {
          if (data.products) {
            const related = data.products
              .filter((p: Product) => p.id !== product.id)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        })
        .catch(() => {
          // Fallback to static catalog
          const related = productCatalog
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
          setRelatedProducts(related);
        });
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

  // Get product images - support multiple images or use placeholder
  const productImages: string[] = product.image 
    ? (typeof product.image === 'string' ? [product.image] : product.image)
    : [getProductImage(product, 800, 800)];
  
  // Ensure we have at least 3 images for gallery (repeat if needed)
  const images: string[] = productImages.length >= 3 
    ? productImages.slice(0, 3)
    : [...productImages, ...Array(3 - productImages.length).fill(productImages[0] || getProductImage(product, 800, 800))];

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

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
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
          <div className="space-y-6">
            <div>
              <p className="text-primary font-medium text-sm mb-2">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-text mb-4">{product.name}</h1>
              
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
              <div className="flex items-center flex-wrap gap-3 mb-6">
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
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={(e) => handleAddToCart(e)}
                    disabled={!product.inStock}
                    className="btn-secondary py-3 flex items-center justify-center space-x-2"
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
                    className="btn-primary py-3 flex items-center justify-center space-x-2"
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
        <div>
          <h2 className="text-3xl font-bold text-text mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                whileHover={{ y: -5 }}
                className="bg-bg border border-border rounded-lg shadow-soft hover:shadow-soft-md transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => router.push(`/product/${relatedProduct.id}`)}
              >
                <div className="relative aspect-square">
                  <Image
                    src={getProductImage(relatedProduct)}
                    alt={relatedProduct.name}
                    fill
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-text mb-2">{relatedProduct.name}</h3>
                  <p className="text-muted text-sm mb-3">{relatedProduct.brand}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-text">
                      {formatPrice(relatedProduct.price)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted">{relatedProduct.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

