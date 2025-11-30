import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const subscriptionBenefits = [
  {
    title: 'Never miss a refill',
    description: 'Schedule auto-deliveries aligned with your supplement cadence. Adjust or pause anytime.',
  },
  {
    title: 'Exclusive pricing',
    description: 'Subscribers lock-in up to 15% savings and early access to product launches.',
  },
  {
    title: 'Smart reminders',
    description: 'We’ll remind you before each shipment so you can tweak timing or quantities stress free.',
  },
]

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold mb-3">Vita subscriptions</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Auto-refill planner</h1>
            <p className="text-muted text-base sm:text-lg">
              Build a predictable routine with scheduled deliveries. Adjust cadence, skip a month or add one-off boosts in clicks.
            </p>
          </div>

          <div className="space-y-4">
            {subscriptionBenefits.map((benefit) => (
              <div key={benefit.title} className="p-6 border border-border rounded-2xl bg-bg shadow-soft">
                <h2 className="text-lg font-semibold text-text mb-1">{benefit.title}</h2>
                <p className="text-sm text-muted leading-relaxed">{benefit.description}</p>
              </div>
            ))}
            <div className="p-6 border border-primary/30 rounded-2xl bg-primary/5">
              <h2 className="text-lg font-semibold text-text mb-2">Ready to set your first subscription?</h2>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Choose a product from your wishlist or order history, then click “Subscribe & save” on the product page.
              </p>
              <Link href="/products" className="btn-primary">Browse supplements</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

