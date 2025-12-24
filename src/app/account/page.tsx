import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const accountHighlights = [
  {
    title: 'Personal details',
    description: 'Update your name, contact info, password and communication preferences.',
  },
  {
    title: 'Payment methods',
    description: 'Securely store cards for faster checkout and manage 3D Secure settings.',
  },
  {
    title: 'Health profile',
    description: 'Tell TAQA AI about your goals so every recommendation is on-point.',
  },
]

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold mb-3">Your Vita account</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Account overview</h1>
            <p className="text-muted text-base sm:text-lg max-w-3xl">
              Everything about you in one secure space. Keep your personal details fresh, manage saved payment methods and guide TAQA AI with up-to-date preferences.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {accountHighlights.map((highlight) => (
              <div key={highlight.title} className="rounded-2xl border border-border shadow-soft bg-bg p-6">
                <h2 className="text-lg font-semibold text-text mb-2">{highlight.title}</h2>
                <p className="text-sm text-muted leading-relaxed">{highlight.description}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <h2 className="text-lg font-semibold text-text mb-2">Protect your journey</h2>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Enable two-factor authentication and keep your recovery email handy. Vita safeguards your wellness data with industry-grade encryption.
              </p>
              <Link href="/contact" className="text-primary font-semibold text-sm">Need help securing your account? Reach Vita Care</Link>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/checkout" className="btn-primary">Fast checkout</Link>
            <Link href="/wishlist" className="btn-outline">View wishlist</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

