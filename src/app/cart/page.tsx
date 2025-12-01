'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/formatters/currency'
import { getProductImage } from '@/utils/helpers/imagePlaceholder'
import { useAuth } from '@/hooks/useAuth'

export default function CartPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useAuth()
  const { items, removeItem, updateQuantity, getTotal, clearCart, syncWithUser } = useCartStore()
  
  useEffect(() => {
    // Sync cart with current user
    if (user) {
      syncWithUser(user.id);
    }
  }, [user, syncWithUser]);
  const total = getTotal()
  const shipping = total > 300 ? 0 : 50 // Free shipping over 300 MAD
  const vat = total * 0.20 // 20% VAT for Morocco
  const finalTotal = total + shipping + vat

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 text-muted/20 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-text mb-4">{t('cart.emptyTitle')}</h1>
            <p className="text-muted mb-8">{t('cart.emptyDescription')}</p>
            <button
              onClick={() => router.push('/products')}
              className="btn-primary"
            >
              {t('cart.browseProducts')}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-text mb-8">{t('cart.title')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.product
              const productId = product.id
              const variantId = item.variant?.id
              const unitPrice = item.variant?.price ?? product.price
              const lineTotal = unitPrice * item.quantity

              return (
              <motion.div
                key={`${productId}-${variantId ?? 'default'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg border border-border rounded-lg shadow-soft p-6 flex flex-col sm:flex-row gap-6"
              >
                <div className="relative w-full sm:w-32 h-32 bg-bg border border-border rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={getProductImage(item.product)}
                    alt={item.product.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text mb-1">{item.product.name}</h3>
                  <p className="text-muted mb-2">{item.product.brand}</p>
                  {item.variant && (
                    <div className="flex flex-wrap gap-2 text-xs text-muted mb-4">
                      <span className="px-2 py-1 bg-border/50 rounded-full">{item.variant.label}</span>
                      {item.variant.dosage && (
                        <span className="px-2 py-1 bg-border/50 rounded-full">{item.variant.dosage}</span>
                      )}
                      {item.variant.packageQuantity && (
                        <span className="px-2 py-1 bg-border/50 rounded-full">{item.variant.packageQuantity}</span>
                      )}
                      {item.variant.flavor && (
                        <span className="px-2 py-1 bg-border/50 rounded-full">{item.variant.flavor}</span>
                      )}
                    </div>
                  )}
                  {!item.variant && product.packageQuantity && (
                    <div className="text-xs text-muted mb-4">
                      {product.packageQuantity}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => updateQuantity(productId, item.quantity - 1, variantId)}
                        className="p-2 border border-border rounded-lg hover:border-primary hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-medium text-text w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(productId, item.quantity + 1, variantId)}
                        className="p-2 border border-border rounded-lg hover:border-primary hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-text">
                        {formatPrice(lineTotal)}
                      </p>
                      <p className="text-sm text-muted">
                        {formatPrice(unitPrice)} {t('cart.each')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(productId, variantId)}
                    className="mt-4 flex items-center text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('cart.remove')}
                  </button>
                </div>
              </motion.div>
            )})}

            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
            >
              {t('cart.clearCart')}
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-bg border border-border rounded-lg shadow-soft p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-text mb-6">{t('cart.orderSummary')}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-medium text-text">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>{t('cart.shipping')}</span>
                  <span className="font-medium text-text">
                    {shipping === 0 ? t('cart.free') : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>{t('cart.vat')}</span>
                  <span className="font-medium text-text">{formatPrice(vat)}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between text-2xl font-bold text-text">
                  <span>{t('cart.total')}</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {total < 300 && (
                <div className="bg-primary/10 border border-primary rounded-lg p-4 mb-6">
                  <p className="text-sm text-text">
                    {t('cart.addMoreForFreeShipping', { amount: formatPrice(300 - total) })}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/checkout')}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('cart.checkout')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="flex-1 btn-outline flex items-center justify-center gap-2"
                >
                  <span>{t('cart.continueShopping')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

