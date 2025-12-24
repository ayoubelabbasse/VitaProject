'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function CoachesPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm uppercase tracking-wide text-primary font-semibold mb-3">Health coaches</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Personalised advice</h1>
        <p className="text-muted text-base sm:text-lg max-w-2xl mb-8">
          Talk to a coach to fine-tune your routine, goals, and supplement stack. Coming soon.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-bg shadow-soft p-6">
            <h2 className="text-lg font-semibold text-text mb-2">What you’ll get</h2>
            <ul className="text-sm text-muted list-disc list-inside space-y-2">
              <li>Goal-based plan (energy, sleep, performance)</li>
              <li>Simple stack suggestions (3 products max)</li>
              <li>Weekly routine guidance</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-primary/5 p-6">
            <h2 className="text-lg font-semibold text-text mb-2">Until then</h2>
            <p className="text-sm text-muted mb-4">
              Use the TAQA quiz to get quick recommendations, then adjust from product details.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="btn-primary">Take the quiz</Link>
              <Link href="/products" className="btn-outline">Shop products</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


