'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, X, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { getProductImage } from '@/utils/helpers/imagePlaceholder'
import { formatCurrency } from '@/utils/formatters/currency'

const AddToCartDrawer = () => {
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen)
  const lastAddedItem = useCartStore((state) => state.lastAddedItem)
  const closeDrawer = useCartStore((state) => state.closeDrawer)
  const total = useCartStore((state) => state.getTotal())
  const itemCount = useCartStore((state) => state.getItemCount())

  useEffect(() => {
    if (!isDrawerOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isDrawerOpen, closeDrawer])

  return (
    <AnimatePresence>
      {isDrawerOpen && lastAddedItem && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[80]"
            onClick={closeDrawer}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-bg border-l border-border shadow-2xl z-[90] flex flex-col"
            role="dialog"
            aria-label="Product added to cart"
          >
            <div className="flex items-start justify-between px-6 py-5 border-b border-border/70">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-text">Added to your cart</p>
                  <p className="text-xs text-muted">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} • Total {formatCurrency(total)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-lg hover:bg-border/50 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-muted" />
              </button>
            </div>

            <div className="px-6 py-5 border-b border-border/70">
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 bg-gradient-to-br from-white via-white to-primary/10 border border-border rounded-xl overflow-hidden flex-shrink-0 p-3">
                  <Image
                    src={getProductImage(lastAddedItem.product)}
                    alt={lastAddedItem.product.name}
                    fill
                    sizes="80px"
                    className="object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text leading-tight line-clamp-2">
                    {lastAddedItem.product.name}
                  </p>
                  <p className="text-xs text-muted mt-1">{lastAddedItem.product.brand}</p>
                  {lastAddedItem.variant && (
                    <p className="text-xs text-muted mt-1">{lastAddedItem.variant.label}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <span className="text-text font-semibold">
                      {formatCurrency((lastAddedItem.variant?.price ?? lastAddedItem.product.price) * lastAddedItem.quantity)}
                    </span>
                    <span className="text-muted">Qty: {lastAddedItem.quantity}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-b border-border/70">
              <p className="text-xs uppercase tracking-wide text-muted mb-3">Cart snapshot</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold text-text">{formatCurrency(total)}</span>
              </div>
              <p className="text-[11px] text-muted mt-2">
                Shipping and taxes calculated at checkout. Add more products or head straight to secure payment.
              </p>
            </div>

            <div className="px-6 py-5 flex flex-col gap-3">
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                Go to checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border font-medium text-sm hover:border-primary hover:text-primary transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                View full cart
              </Link>
              <button
                onClick={closeDrawer}
                className="text-sm font-medium text-muted hover:text-text transition-colors"
              >
                Continue shopping
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddToCartDrawer

