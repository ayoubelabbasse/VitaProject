import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const rewardsTiers = [
  {
    tier: 'Essentials',
    points: '0 – 499 pts',
    benefits: 'Earn 3% back on every supplement purchase and unlock birthday perks.',
  },
  {
    tier: 'Elevate',
    points: '500 – 1,499 pts',
    benefits: 'Enjoy 6% back, early sale access and free samples tailored by Vita AI.',
  },
  {
    tier: 'Elite',
    points: '1,500+ pts',
    benefits: 'Unlock 10% back, complimentary express shipping and 1:1 wellness coaching drops.',
  },
]

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold mb-3">Vita rewards</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Earn wellness perks</h1>
            <p className="text-muted text-base sm:text-lg max-w-3xl">
              Collect Vita Points on every order, bonus challenges and referrals. Redeem for discounts, gifts and exclusive wellness sessions.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {rewardsTiers.map((tier) => (
              <div key={tier.tier} className="p-6 border border-border rounded-2xl bg-bg shadow-soft text-center">
                <p className="text-xs uppercase tracking-wider text-primary mb-2">{tier.tier}</p>
                <h2 className="text-lg font-semibold text-text mb-3">{tier.points}</h2>
                <p className="text-sm text-muted leading-relaxed">{tier.benefits}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-6">
            <h2 className="text-xl font-semibold text-text mb-3">Boost your balance faster</h2>
            <ul className="space-y-2 text-sm text-muted list-disc list-inside">
              <li>Refer friends and family with a personalised Vita invite link.</li>
              <li>Complete seasonal wellness challenges inside the Vita AI hub.</li>
              <li>Subscribe to auto-refill bundles for double points every renewal.</li>
            </ul>
            <Link href="/products" className="btn-primary mt-6 inline-block">Shop and earn</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

