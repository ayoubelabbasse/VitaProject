import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const addressGuidelines = [
  {
    title: 'Delivery profiles',
    description: 'Store multiple shipping addresses — home, office, gym — and name them for quick selection at checkout.',
  },
  {
    title: 'Smart defaults',
    description: 'Set a preferred address, VAT info and delivery instructions to skip manual entry each time.',
  },
  {
    title: 'Regional coverage',
    description: 'We service all major Moroccan cities with express shipping and offer secure locker pickup in Casablanca & Rabat.',
  },
]

export default function AddressesPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold mb-3">Shipping addresses</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Manage delivery details</h1>
            <p className="text-muted text-base sm:text-lg">
              Keep your delivery info accurate for frictionless checkout. Update instructions for couriers and store VAT data for invoices.
            </p>
          </div>

          <div className="space-y-4">
            {addressGuidelines.map((item) => (
              <div key={item.title} className="p-6 border border-border rounded-2xl bg-bg shadow-soft">
                <h2 className="text-lg font-semibold text-text mb-1">{item.title}</h2>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
            <div className="p-6 border border-primary/30 rounded-2xl bg-primary/5">
              <h2 className="text-lg font-semibold text-text mb-2">Tip: update before your next order</h2>
              <p className="text-sm text-muted leading-relaxed mb-4">
                The easiest way to edit addresses is right after placing an order. Click “Save for future” at the confirmation step.
              </p>
              <Link href="/products" className="btn-primary">Continue shopping</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

