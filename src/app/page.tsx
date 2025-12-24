'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Zap, Shield, Heart, ArrowRight, ShieldCheck, CreditCard, Truck, Leaf, Moon, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'
import { getProductImage } from '@/utils/helpers/imagePlaceholder'
import { productCatalog } from '@/data/products'

// NOTE: Tiny homepage comment change to trigger a fresh Vercel deployment.

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
    image: '/images/products/Magnesium-and-lactobif-nature.jpg',
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

const heroSlides = [
  {
    key: 'classics',
    image: '/images/products/hero-carousel-1.png',
    alt: 'TAQA hero – classics curated for daily rituals',
    eyebrow: 'TAQA ESSENTIALS',
    titleLines: ['Classics curated', 'for daily rituals'],
    subtitle: 'Build a simple daily stack and save up to 20% extra.',
    mode: 'light' as const,
    ctaLabel: 'Shop Now',
    ctaHref: '/products',
    ctaVariant: 'dark' as const,
  },
  {
    key: 'build-save',
    image: '/images/products/hero-carousel-2.jpg',
    alt: 'Build your TAQA routine and save 10%',
    eyebrow: '',
    titleLines: [],
    subtitle: '',
    mode: 'dark' as const,
    ctaLabel: 'Build Routine · 10% OFF',
    ctaHref: '/products',
    ctaVariant: 'green' as const,
  },
  {
    key: 'morocco-first',
    image: '/images/products/hero-carousel-3.jpg',
    alt: 'Take the TAQA quiz and save 10%',
    eyebrow: '',
    titleLines: [],
    subtitle: '',
    mode: 'dark' as const,
    ctaLabel: 'Take Quiz · 10% OFF',
    ctaHref: '/products',
    ctaVariant: 'green' as const,
  },
]

// Trust signals – simple 3-step flow
const trustSignals = [
  {
    icon: ShieldCheck,
    step: 'Step 1',
    title: 'Quality & authenticity',
    description: 'We source original brands and check products before shipping.',
  },
  {
    icon: CreditCard,
    step: 'Step 2',
    title: 'Choose how you pay',
    description: 'Cash on delivery or secure online payment in MAD.',
  },
  {
    icon: Truck,
    step: 'Step 3',
    title: 'Fast delivery',
    description: 'Your order is packed and delivered quickly to your address.',
  },
]

export default function HomePage() {
  const { t } = useTranslation()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
  const [heroIndex, setHeroIndex] = useState(0)
  const [isHeroPlaying, setIsHeroPlaying] = useState(true)
  const heroFirstRun = useRef(true)
  const featuredScrollRef = useRef<HTMLDivElement | null>(null)
  const recentScrollRef = useRef<HTMLDivElement | null>(null)

  // Fetch featured products from database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        if (data.products && data.products.length > 0) {
          setFeaturedProducts(data.products.slice(0, 10))
        } else {
          // Fallback to static catalog
          setFeaturedProducts(productCatalog.slice(0, 10))
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
        // Fallback to static catalog
        setFeaturedProducts(productCatalog.slice(0, 4))
      }
    }
    fetchFeaturedProducts()
  }, [])

  // Load recently viewed products from localStorage (if any)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const STORAGE_KEY = 'vita_recent_products'
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const items: Product[] = JSON.parse(raw)
      if (Array.isArray(items) && items.length > 0) {
        // Only show when the customer has a meaningful history (at least 3 items)
        setRecentlyViewed(items.slice(0, 8))
      }
    } catch (e) {
      console.warn('Failed to load recently viewed products', e)
    }
  }, [])

  // Hero carousel autoplay
  useEffect(() => {
    if (!isHeroPlaying) return
    const delay = heroFirstRun.current ? 8000 : 5000
    const timer = setTimeout(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length)
      heroFirstRun.current = false
    }, delay)
    return () => clearTimeout(timer)
  }, [heroIndex, isHeroPlaying])

  const goToNextHero = () => {
    heroFirstRun.current = false
    setHeroIndex((prev) => (prev + 1) % heroSlides.length)
  }

  const goToPrevHero = () => {
    heroFirstRun.current = false
    setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const toggleHeroPlay = () => {
    setIsHeroPlaying((prev) => !prev)
  }

  const currentHero = heroSlides[heroIndex]
  const isLightMode = currentHero.mode === 'light'

  const scrollFeatured = (direction: 'left' | 'right') => {
    const node = featuredScrollRef.current
    if (!node) return
    const amount = node.clientWidth * 0.6
    node.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const scrollRecent = (direction: 'left' | 'right') => {
    const node = recentScrollRef.current
    if (!node) return
    const amount = node.clientWidth * 0.6
    node.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <Header />
      
      {/* Hero Section - Carousel */}
      <section className="bg-gradient-to-br from-[#ECE9E6] to-[#FFFFFF]">
        <div className="vita-container py-4">
          <div className="relative h-[280px] sm:h-[340px] md:h-[380px] border-x border-[#E5E7EB] overflow-hidden rounded-none">
            <motion.div
              key={currentHero.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={currentHero.image}
                alt={currentHero.alt}
                fill
                priority={heroIndex === 0}
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>

            {/* Content overlay */}
            <div className="absolute inset-y-0 left-6 sm:left-10 flex items-center px-4">
              <motion.div
                key={`${currentHero.key}-content`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-left space-y-3 max-w-md"
              >
                {currentHero.eyebrow && (
                  <p
                    className={`text-[11px] tracking-[0.45em] uppercase font-semibold ${
                      isLightMode ? 'text-white drop-shadow-md' : 'text-[#11998E]'
                    }`}
                  >
                    {currentHero.eyebrow}
                  </p>
                )}
                {currentHero.titleLines.length > 0 && (
                  <h1
                    className={`text-3xl sm:text-[2.3rem] font-semibold leading-tight ${
                      isLightMode ? 'text-white drop-shadow-md' : 'text-[#111827]'
                    }`}
                  >
                    {currentHero.titleLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                )}
                {currentHero.subtitle && (
                  <p
                    className={`text-sm sm:text-base max-w-sm ${
                      isLightMode ? 'text-white/90 drop-shadow' : 'text-[#4B5563]'
                    }`}
                  >
                    {currentHero.subtitle}
                  </p>
                )}
                {currentHero.key === 'morocco-first' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('openTaqaQuiz'))
                      }
                    }}
                    className={`inline-flex items-center justify-center rounded-sm px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] shadow-lg transition hover:opacity-95 ${
                      currentHero.ctaVariant === 'green'
                        ? 'bg-gradient-to-br from-[#11998E] to-[#38EF7D] text-white'
                        : 'bg-gradient-to-br from-[#232526] to-[#414345] text-white'
                    }`}
                  >
                    {currentHero.ctaLabel}
                  </button>
                ) : (
                  <Link
                    href={currentHero.ctaHref}
                    className={`inline-flex items-center justify-center rounded-sm px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] shadow-lg transition hover:opacity-95 ${
                      currentHero.ctaVariant === 'green'
                        ? 'bg-gradient-to-br from-[#11998E] to-[#38EF7D] text-white'
                        : 'bg-gradient-to-br from-[#232526] to-[#414345] text-white'
                    }`}
                  >
                    {currentHero.ctaLabel}
                  </Link>
                )}
              </motion.div>
            </div>

            {/* Carousel controls */}
            <button
              type="button"
              onClick={goToPrevHero}
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-white hover:bg-white/50 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goToNextHero}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-white hover:bg-white/50 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Play / pause tiny control */}
            <button
              type="button"
              onClick={toggleHeroPlay}
              className="absolute bottom-3 left-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-[#111827] hover:bg-white transition-colors shadow-sm"
              aria-label={isHeroPlaying ? 'Pause carousel' : 'Play carousel'}
            >
              {isHeroPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </section>

      {/* Recently Viewed Products */}
      {recentlyViewed.length >= 3 && (
        <section className="bg-white py-8">
          <div className="vita-container">
            <div className="mb-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-text-main font-semibold">
                Recently viewed
              </p>
            </div>
            <div className="relative">
              <div
                ref={recentScrollRef}
                className="flex gap-4 md:gap-6 overflow-x-auto pb-2"
              >
                {recentlyViewed.slice(0, 12).map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="flex-shrink-0"
                  >
                    <motion.div
                      whileHover={{ y: -6, scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center transition-transform duration-200"
                    >
                      <div className="relative w-[78%] h-[78%]">
                        <Image
                          src={getProductImage(product)}
                          alt={product.name}
                          fill
                          sizes="128px"
                          className="object-contain"
                        />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {recentlyViewed.length > 4 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollRecent('left')}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 h-7 w-7 items-center justify-center rounded-full bg-white shadow-md text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                    aria-label="Scroll recently viewed left"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRecent('right')}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 h-7 w-7 items-center justify-center rounded-full bg-white shadow-md text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                    aria-label="Scroll recently viewed right"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Spotlight Collections */}
      <section className="bg-white py-8">
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

      {/* How TAQA works – 3 simple steps */}
      <section className="bg-[#F5F7FA] py-8">
        <div className="vita-container">
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-text-muted font-semibold">
              How TAQA works
            </p>
          </div>
          <div className="grid gap-4 md:gap-6 md:grid-cols-3">
            {trustSignals.map((signal) => {
              const Icon = signal.icon
              return (
                <div
                  key={signal.title}
                  className="rounded-2xl bg-white border border-border-soft/80 px-5 py-4 md:px-6 md:py-5 flex flex-col gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#E8F0F3] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#11998E]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                        {signal.step}
                      </span>
                      <h3 className="text-sm md:text-base font-semibold text-text-main">
                        {signal.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    {signal.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products - horizontal scroller */}
      <section className="pt-8 pb-6 bg-[#F5F7FA]">
        <div className="vita-container">
          <div className="text-center mb-5">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs uppercase tracking-[0.3em] text-[#6B7280] font-semibold"
            >
              CHAMPION'S CHOICE
            </motion.span>
          </div>
          <div className="relative">
            <div
              ref={featuredScrollRef}
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
            >
              {featuredProducts.slice(0, 10).map((product) => (
                <div
                  key={product.id}
                  className="min-w-[220px] sm:min-w-[260px] lg:min-w-[240px] flex-shrink-0"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Scroll arrows */}
            <div className="hidden md:flex absolute inset-y-0 left-0 items-center pointer-events-none">
              <button
                type="button"
                onClick={() => scrollFeatured('left')}
                className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                aria-label="Scroll featured products left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="hidden md:flex absolute inset-y-0 right-0 items-center pointer-events-none">
              <button
                type="button"
                onClick={() => scrollFeatured('right')}
                className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                aria-label="Scroll featured products right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-[#111827] hover:text-[#11998E] transition-colors">
              <span>Browse full catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lifestyle Motivation */}
      <section className="bg-white">
        <div className="vita-container grid gap-6 lg:grid-cols-[1.05fr,0.95fr] items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Stronger Every Day
            </span>
            <h2 className="heading-lg">
              Stronger every day
            </h2>
            <p className="text-sm md:text-base text-text-muted max-w-xl">
              Start with one or two essentials, stay consistent, and let TAQA handle the quality, sourcing and delivery. Small choices, repeated daily, compound into real energy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products?category=Performance"
                className="inline-flex items-center justify-center rounded-sm bg-gradient-to-br from-[#232526] to-[#414345] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-white shadow-md transition-all hover:from-[#11998E] hover:to-[#38EF7D] focus:outline-none focus:ring-2 focus:ring-[#11998E]/40 focus:ring-offset-2"
              >
                Explore Stacks
              </Link>
              <Link href="/about" className="btn-link flex items-center gap-2">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative h-[320px] md:h-[360px] overflow-hidden shadow-lg">
            <Image
              src="/images/hero/front-1.jpg"
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