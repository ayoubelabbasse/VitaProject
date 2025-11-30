'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-bg border border-border rounded-2xl shadow-soft p-8 sm:p-12">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold mb-3">
              Account Support
            </p>
            <h1 className="text-3xl font-bold text-text mb-4">
              Reset your password
            </h1>
            <p className="text-muted mb-10 max-w-2xl">
              Enter the email associated with your Vita account. We’ll send a secure link so you can create a new password. If you signed up with Google or Apple continue using that provider.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text placeholder:text-muted"
                  placeholder="you@example.com"
                />
              </div>

              <button type="submit" className="btn-primary w-full sm:w-auto">
                Send reset instructions
              </button>
            </form>

            {submitted && (
              <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6 text-sm text-text">
                <p className="font-medium mb-2">Check your inbox</p>
                <p className="text-muted">
                  If an account matches <span className="text-text font-medium">{email}</span>, we sent reset instructions. They expire in 30 minutes.
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                Back to login
              </Link>
              <div className="text-muted">
                Need help? <Link href="/contact" className="text-primary hover:text-primary/80 font-semibold">Contact support</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

