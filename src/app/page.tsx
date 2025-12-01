'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Zap, Shield, Heart, Brain, ArrowRight, ShieldCheck, CreditCard, Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

import { productCatalog } from '@/data/products'

// Health categories with powerful icons
const healthCategories = [
  { key: 'strength', icon: Zap, color: 'from-herbal-green to-deep-olive' },
  { key: 'immunity', icon: Shield, color: 'from-mint-accent to-herbal-green' },
  { key: 'heart', icon: Heart, color: 'from-deep-olive to-herbal-green' },
  { key: 'brain', icon: Brain, color: 'from-herbal-green to-mint-accent' }
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
      
      {/* Hero Section - Full Width Image with Overlay Text */}
      <section className="relative bg-[#FFFFFF] overflow-hidden">
        <div className="vita-container py-3 md:py-4">
          <div className="relative w-full h-[263px] sm:h-[300px] md:h-[338px] lg:h-[375px] border border-[#E5E7EB] rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Full Width Background Image */}
            <div className="absolute inset-0 w-full h-full bg-white">
              <img
                src="/images/hero/imagesProducts.png"
                alt="Premium supplements - TAQA Essentials"
                className="w-full h-full object-contain object-center"
                style={{ 
                  objectPosition: 'center center',
                  imageRendering: 'crisp-edges',
                  transform: 'scale(0.9)',
                  filter: 'contrast(1.05) brightness(1.02)'
                }}
              />
            </div>

            {/* Overlay Gradient for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent z-10"></div>

            {/* Overlay Text Content - Left Side Inside Image */}
            <div className="relative z-20 h-full flex items-center justify-start pl-4 sm:pl-6 md:pl-8 lg:pl-12">
              <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white/95 backdrop-blur-md rounded-xl p-4 sm:p-5 md:p-6 lg:p-7 shadow-2xl border border-white/50">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2 sm:space-y-3"
                >
                  {/* Header: TAQA Essentials with Logo */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm sm:text-base md:text-lg font-semibold leading-tight text-[#11998E] tracking-wide uppercase mb-3"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.15em' }}
                  >
                    <span className="flex items-center whitespace-nowrap gap-2">
                      {/* V Icon from Logo */}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0"
                      >
                        <path
                          d="M16 4 L24 28 L20 28 L16 12 L12 28 L8 28 Z"
                          fill="#11998E"
                        />
                        <circle cx="16" cy="8" r="2" fill="#38EF7D" />
                      </svg>
                      <span className="relative inline-block">
                        <span className="font-bold tracking-wider relative text-[#11998E]">
                          <span className="relative z-10">TA</span>
                          <span className="relative z-10 inline-block mx-0.5">
                            <span className="relative">
                              <span>Q</span>
                              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gradient-to-br from-[#11998E] to-[#38EF7D] rounded-full opacity-70"></span>
                            </span>
                          </span>
                          <span className="relative z-10">A</span>
                        </span>
                      </span>
                      <span className="ml-1.5 font-semibold text-[#38EF7D]">ESSENTIALS</span>
                    </span>
                  </motion.h2>

                  {/* Main Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-0.5 pt-1 sm:pt-2"
                  >
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-[#111827]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      FUEL YOUR
                    </p>
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-[#111827]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      POTENTIAL.
                    </p>
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-[#38EF7D]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Naturally.
                    </p>
                  </motion.div>

                  {/* Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-3 sm:pt-4"
                  >
                    <Link href="/products">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-br from-[#11998E] to-[#38EF7D] hover:from-[#1AB99A] hover:to-[#4DFF8F] text-white font-semibold py-2.5 px-7 rounded-full text-sm sm:text-base transition-all duration-200 shadow-xl hover:shadow-2xl"
                      >
                        Shop Now
                      </motion.button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
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
      <section className="pt-10 pb-6 bg-white">
        <div className="vita-container">
          <div className="text-center mb-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs uppercase tracking-[0.3em] text-[#6B7280] font-semibold mb-4"
            >
              YOUR ARSENAL
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-semibold text-[#111827] mb-4 leading-tight"
            >
              Power Your Performance
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base text-[#6B7280] max-w-2xl mx-auto"
            >
              Discover supplements designed for every aspect of your health and performance journey.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthCategories.map((category) => {
              const IconComponent = category.icon;
              // Map category keys to actual product categories
              const categoryMap: Record<string, string> = {
                'strength': 'Performance',
                'immunity': 'Immune',
                'heart': 'Heart Health',
                'brain': 'Brain Health'
              };
              const targetCategory = categoryMap[category.key];
              
              return (
                <Link key={category.key} href={`/products?category=${targetCategory}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl p-8 border border-border-soft shadow-sm hover:shadow-xl hover:border-[#11998E]/30 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="w-16 h-16 bg-[#E8F0F3] rounded-full flex items-center justify-center mb-6 mx-auto transition-transform group-hover:scale-110">
                      <IconComponent className="w-8 h-8 text-[#11998E]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#111827] mb-2 text-center group-hover:bg-gradient-to-r group-hover:from-[#11998E] group-hover:to-[#38EF7D] group-hover:bg-clip-text group-hover:text-transparent transition-colors">
                      {t(`homepage.categories.${category.key}.name`)}
                    </h3>
                    <p className="text-sm text-[#6B7280] text-center">
                      {t(`homepage.categories.${category.key}.description`)}
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

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
      <section className="bg-white pt-20">
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