'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function OrderSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bg border border-border rounded-lg shadow-soft-lg p-12 max-w-2xl mx-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-text mb-4">Order Confirmed!</h1>
          <p className="text-lg text-muted mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>

          <div className="bg-bg border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 text-text mb-2">
              <Package className="w-5 h-5" />
              <span className="font-medium">Order #ORD-{Date.now().toString().slice(-8)}</span>
            </div>
            <p className="text-sm text-muted">
              You will receive a confirmation email shortly
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders" className="btn-primary flex items-center justify-center">
              View Orders
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button
              onClick={() => router.push('/products')}
              className="btn-outline"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}

