'use client'

import { Truck, Clock, Package, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-text mb-8">Shipping Information</h1>
        <div className="space-y-6">
          <div className="bg-bg border border-border rounded-lg shadow-soft p-8">
            <div className="flex items-center space-x-4 mb-6">
              <Truck className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-text">Delivery Options</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-text mb-2">Standard Delivery</h3>
                <p className="text-muted">3-5 business days - 50 MAD (Free for orders over 300 MAD)</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-text mb-2">Express Delivery</h3>
                <p className="text-muted">1-2 business days - 100 MAD</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-text mb-2">Store Pickup</h3>
                <p className="text-muted">Same day - Free (Casablanca location only)</p>
              </div>
            </div>
          </div>
          <div className="bg-bg border border-border rounded-lg shadow-soft p-8">
            <Clock className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-text mb-4">Processing Time</h2>
            <p className="text-muted">Orders are processed within 1-2 business days. You'll receive tracking information once your order ships.</p>
          </div>
          <div className="bg-bg border border-border rounded-lg shadow-soft p-8">
            <MapPin className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-text mb-4">Shipping Areas</h2>
            <p className="text-muted">We ship to all major cities in Morocco. Free shipping available for orders over 300 MAD.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

