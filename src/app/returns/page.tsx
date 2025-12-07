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
            <p className="text-muted mb-4">
              Returns are available only for online orders that were paid in advance by bank card, and only for
              unopened products.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>Only orders paid online by bank card are eligible for return.</li>
              <li>Products must be completely unopened and in their original sealed packaging.</li>
              <li>Return requests must be made within 3 days of receiving your order.</li>
              <li>For non‑defective items, return shipping may be at the customer&apos;s expense.</li>
              <li>Refunds are processed back to the same bank card once the products are inspected.</li>
            </ul>
          </div>
          <div className="bg-bg border border-border rounded-lg shadow-soft p-8">
            <Clock className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-text mb-4">How to Return</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted">
              <li>Contact our customer service team within 3 days of receiving your order.</li>
              <li>Provide your order number and confirm that products are unopened.</li>
              <li>We will share return instructions and the address for sending back the items.</li>
              <li>Package the items securely in the original packaging and ship them back to us.</li>
              <li>After inspection, your refund will be issued to the original bank card.</li>
            </ol>
          </div>
          <div className="bg-bg border border-border rounded-lg shadow-soft p-8">
            <CheckCircle className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-text mb-4">Exchanges</h2>
            <p className="text-muted">
              At this time, exchanges are handled as a return and new purchase. If you need a different product,
              please request a refund for the eligible items and place a new order.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

