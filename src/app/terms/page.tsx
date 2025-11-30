'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-text mb-8">Terms of Service</h1>
        <div className="bg-bg border border-border rounded-lg shadow-soft p-8 space-y-6 text-muted leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using VitaFlow, you accept and agree to be bound by these Terms of Service.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">2. Products and Pricing</h2>
            <p>All prices are in Moroccan Dirham (MAD) and include VAT. We reserve the right to change prices at any time.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">3. Orders</h2>
            <p>By placing an order, you agree to provide accurate information. We reserve the right to refuse or cancel any order.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">4. Returns and Refunds</h2>
            <p>Returns are accepted within 30 days of purchase for unopened products. See our Returns Policy for details.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">5. Limitation of Liability</h2>
            <p>VitaFlow is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
          </section>
          <p className="text-sm text-muted mt-8">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

