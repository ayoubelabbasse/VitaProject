import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const wishlistTips = [
  {
    title: 'Plan your next stack',
    description: 'Save supplements you want to test and TAQA AI will nudge you when bundles go on sale.',
  },
  {
    title: 'Share with friends',
    description: 'Generate a shareable link so friends, family or coaches can see what you are taking.',
  },
  {
    title: 'Sync with cart',
    description: 'Move items to cart in one click and keep your wellness goals front and centre.',
  },
]

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold mb-3">Wishlist</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Save wellness favourites</h1>
            <p className="text-muted text-base sm:text-lg">
              Keep an eye on supplements you love. Add from product cards, organise by routine and checkout when you are ready.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {wishlistTips.map((tip) => (
              <div key={tip.title} className="p-6 border border-border rounded-2xl bg-bg shadow-soft">
                <h2 className="text-lg font-semibold text-text mb-2">{tip.title}</h2>
                <p className="text-sm text-muted leading-relaxed">{tip.description}</p>
              </div>
            ))}
            <div className="p-6 border border-primary/30 rounded-2xl bg-primary/5">
              <h2 className="text-lg font-semibold text-text mb-2">Nothing saved yet</h2>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Browse the Vita catalogue and tap the heart icon on any product to start building your personal regimen.
              </p>
              <Link href="/products" className="btn-primary">Discover products</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

