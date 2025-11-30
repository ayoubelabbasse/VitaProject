'use client'

import Link from 'next/link'
import { useMemo, type ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { Brain, HeartPulse, ShieldCheck, Dumbbell } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { productCatalog } from '@/data/products'

const categoryIconMap: Record<string, ComponentType<{ className?: string }>> = {
  'Heart Health': HeartPulse,
  'Brain Health': Brain,
  Immune: ShieldCheck,
  Performance: Dumbbell,
}

const categoryDescriptionMap: Record<string, string> = {
  'Heart Health': 'Support cardiovascular function, healthy cholesterol levels, and overall circulation.',
  'Brain Health': 'Boost focus, memory, cognition, and maintain long-term neurological vitality.',
  Immune: 'Strengthen your natural defenses with vitamins, minerals, and herbal immune boosters.',
  Performance: 'Enhance strength, endurance, recovery, and daily athletic output.',
}

export default function CategoriesPage() {
  const { t } = useTranslation()

  const categories = useMemo(() => {
    const grouped = productCatalog.reduce<Record<string, typeof productCatalog>>((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push(product)
      return acc
    }, {})

    return Object.entries(grouped)
      .map(([category, products]) => ({ category, products }))
      .sort((a, b) => a.category.localeCompare(b.category))
  }, [])

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main>
        <section className="bg-gradient-to-br from-primary/10 via-bg to-bg border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-4">
              {t('productsPage.filter')}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Explore Wellness Categories
            </h1>
            <p className="text-muted max-w-2xl text-base sm:text-lg">
              Browse curated collections tailored to your goals. Jump directly into a category to see products, research-backed benefits, and guided recommendations.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map(({ category, products }) => {
              const Icon = categoryIconMap[category] ?? ShieldCheck
              const description = categoryDescriptionMap[category] ?? 'Hand-picked supplements designed to support your daily vitality and long-term wellbeing.'
              const topProducts = products.slice(0, 3)

              return (
                <article
                  key={category}
                  className="border border-border rounded-2xl bg-bg shadow-soft hover:shadow-soft-md transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex items-start space-x-4 border-b border-border/70">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-text mb-1">{category}</h2>
                      <p className="text-sm text-muted leading-relaxed">{description}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1">
                    <div>
                      <h3 className="text-sm font-semibold text-text uppercase tracking-wide mb-2">
                        Top Picks
                      </h3>
                      <ul className="space-y-2">
                        {topProducts.map((product) => (
                          <li key={product.id} className="flex items-start space-x-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden />
                            <span className="text-sm text-text leading-snug">
                              {product.name}
                              <span className="text-muted"> · {product.packageQuantity ?? 'Standard Pack'}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                      <p className="text-sm text-muted">
                        {products.length} products available · From{' '}
                        <span className="text-text font-medium">
                          {Math.min(...products.map((product) => product.price)).toFixed(2)} MAD
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-6 border-t border-border/70 bg-bg/80">
                    <Link
                      href={`/products?category=${encodeURIComponent(category)}`}
                      className="btn-primary w-full text-center"
                    >
                      {t('productsPage.viewProducts') ?? 'Shop this category'}
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

