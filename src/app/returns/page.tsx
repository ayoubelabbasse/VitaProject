'use client'

import { RotateCcw, Clock, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-text mb-8">Returns & Refunds</h1>
        <div className="space-y-6">
          <div className="bg-bg border border-border rounded-lg shadow-soft p-8">
            <RotateCcw className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-text mb-4">Return Policy</h2>
            <p className="text-muted mb-4">We offer a 30-day return policy for unopened products in their original packaging.</p>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>Products must be unopened and in original packaging</li>
              <li>Return requests must be made within 30 days of purchase</li>
              <li>Return shipping is free for defective or damaged items</li>
              <li>Refunds are processed within 5-7 business days after we receive the returned item</li>
            </ul>
          </div>
          <div className="bg-bg border border-border rounded-lg shadow-soft p-8">
            <Clock className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-text mb-4">How to Return</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted">
              <li>Contact our customer service team to initiate a return</li>
              <li>We'll provide a return authorization and shipping label</li>
              <li>Package the item securely in its original packaging</li>
              <li>Ship the item back to us using the provided label</li>
              <li>Once received, we'll process your refund</li>
            </ol>
          </div>
          <div className="bg-bg border border-border rounded-lg shadow-soft p-8">
            <CheckCircle className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-text mb-4">Exchanges</h2>
            <p className="text-muted">We offer product exchanges within 30 days of purchase. Contact customer service to arrange an exchange.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

