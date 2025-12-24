'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm uppercase tracking-wide text-primary font-semibold mb-3">Blog</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">TAQA guides & tips</h1>
        <p className="text-muted text-base sm:text-lg max-w-2xl mb-8">
          We’re building short, practical articles for supplements, routines, and performance. Coming soon.
        </p>

        <div className="rounded-2xl border border-border bg-bg shadow-soft p-6">
          <h2 className="text-lg font-semibold text-text mb-2">Next up</h2>
          <ul className="text-sm text-muted list-disc list-inside space-y-2">
            <li>How to pick a daily stack (energy, sleep, immunity)</li>
            <li>Omega-3 basics: what to look for</li>
            <li>Magnesium: which type is best for you?</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">Shop products</Link>
            <Link href="/categories" className="btn-outline">Browse categories</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


