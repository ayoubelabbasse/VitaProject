'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Zap, Shield, Heart, ArrowRight, ShieldCheck, CreditCard, Truck, Leaf, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

import { productCatalog } from '@/data/products'

const curatedCollections = [
  {
    key: 'daily',
    label: 'Daily Essentials',
    image: '/images/products/alive-omega3-nature.jpg',
    icon: Leaf,
    href: '/products?category=Vitamins',
  },
  {
    key: 'performance',
    label: 'Performance',
    image: '/images/products/creatine-nature.jpg',
    icon: Zap,
    href: '/products?category=Performance',
  },
  {
    key: 'wellness',
    label: 'Wellness',
    image: '/images/products/magnesium-and-lactobif-nature.jpg',
    icon: Shield,
    href: '/products?category=Wellness',
  },
  {
    key: 'rest',
    label: 'Rest & Recovery',
    image: '/images/products/melatonin-nature.png',
    icon: Moon,
    href: '/products?category=Relaxation',
  },
]

// Trust signals for Moroccan customers
const trustSignals = [
  { icon: ShieldCheck, title: 'Imported Quality', description: 'Sourced from trusted global brands' },
  { icon: CreditCard, title: 'Secure Payments', description: 'Encrypted checkout in MAD' },
  { icon: Truck, title: 'Fast Delivery', description: 'Nationwide shipping across Morocco' },
]

export default function HomePage() {
  const { t } = useTranslation()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  // Fetch featured products from database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        if (data.products && data.products.length > 0) {
          setFeaturedProducts(data.products.slice(0, 4))
        } else {
          // Fallback to static catalog
          setFeaturedProducts(productCatalog.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
        // Fallback to static catalog
        setFeaturedProducts(productCatalog.slice(0, 4))
      }
    }
    fetchFeaturedProducts()
  }, [])

  return (
    <div className="min-h-screen bg-bg-main">
      <Header />
      
      {/* Hero Section - Edge-to-edge image */}
      <section className="bg-gradient-to-br from-[#ECE9E6] to-[#FFFFFF]">
        <div className="vita-container py-6">
          <div className="relative h-[280px] sm:h-[340px] md:h-[380px] border-x border-[#E5E7EB] overflow-hidden rounded-none">
            <Image
              src="/images/products/Hero-Image-taqa.png"
              alt="TAQA hero"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-y-0 left-6 sm:left-10 flex items-center px-4">
              <div className="text-left text-white space-y-4 max-w-md">
                <p className="text-xs tracking-[0.5em] uppercase">TAQA ESSENTIALS</p>
                <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-white">
                  Classics Curated
                  <br />
                  for Daily Rituals
                </h1>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-sm bg-gradient-to-br from-[#232526] to-[#414345] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-white shadow-lg transition hover:opacity-90"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Collections */}
      <section className="bg-white py-10">
        <div className="vita-container">
          <div className="text-center mb-6">
            <p className="inline-block text-xs uppercase tracking-[0.4em] text-[#6B7280] font-semibold">Your Arsenal</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {curatedCollections.map((collection) => {
              const Icon = collection.icon
              return (
                <Link key={collection.key} href={collection.href} className="group block">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="relative h-44 rounded-md overflow-hidden border border-[#D1D5DB] shadow-sm transition-all duration-300"
                  >
                    <Image
                      src={collection.image}
                      alt={collection.label}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width:1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-white">
                      <p className="text-sm font-semibold tracking-[0.35em] uppercase drop-shadow">
                        {collection.label}
                      </p>
                      <Icon className="h-6 w-6 drop-shadow" />
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-white">
        <div className="vita-container py-4 md:py-6">
          <div className="grid gap-4 md:gap-6 md:grid-cols-3">
            {trustSignals.map((signal) => {
              const Icon = signal.icon
              return (
                <div
                  key={signal.title}
                  className="flex items-center gap-4 rounded-2xl border border-border-soft p-4 md:p-5 bg-[#F9FAFB]"
                >
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#E8F0F3] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#11998E]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-main text-sm md:text-base">{signal.title}</p>
                    <p className="text-xs md:text-sm text-text-muted">{signal.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section - Your Arsenal */}
      {/* Featured Products - Champion's Choice */}
      <section className="pt-10 pb-6 bg-[#F5F7FA]">
        <div className="vita-container">
          <div className="text-center mb-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs uppercase tracking-[0.3em] text-[#6B7280] font-semibold mb-4"
            >
              CHAMPION'S CHOICE
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-semibold text-[#111827] mb-4 leading-tight"
            >
              Featured Products
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base text-[#6B7280]"
            >
              Trusted supplements for performance and daily wellness.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border-2 border-[#11998E] text-[#11998E] hover:bg-gradient-to-br hover:from-[#11998E] hover:to-[#38EF7D] hover:text-white font-medium px-8 py-3 rounded-full text-sm transition-all duration-200 inline-flex items-center gap-2"
              >
                <span>{t('homepage.featured.viewAll')}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lifestyle Motivation */}
      <section className="bg-white pt-10">
        <div className="vita-container py-16 grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Stronger Every Day
            </span>
            <h2 className="heading-lg">
              Build Your Daily Ritual
            </h2>
            <p className="text-body text-text-muted max-w-xl">
              Pair targeted stacks with intentional movement. TAQA curates performance-driven protocols so you can lift, recover, and show up energized — all week.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products?category=Performance" className="btn-primary">
                Explore Stacks
              </Link>
              <Link href="/about" className="btn-link flex items-center gap-2">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative h-[320px] md:h-[360px] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/images/hero/front.jpg"
              alt="Active lifestyle inspiration"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2a4a52]/25 to-transparent" />
          </div>
        </div>
      </section>


      
      <Footer />
    </div>
  )
} 