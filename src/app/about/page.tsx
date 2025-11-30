'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, Heart, Award, Users, Leaf } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const values = [
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'All products are imported from trusted global brands and tested for quality',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping across Morocco with reliable delivery partners',
  },
  {
    icon: Heart,
    title: 'Your Health First',
    description: 'We care about your wellbeing and provide expert consultation',
  },
  {
    icon: Award,
    title: 'Certified Products',
    description: 'All supplements meet international quality standards',
  },
]

const stats = [
  { number: '10,000+', label: 'Happy Customers' },
  { number: '500+', label: 'Premium Products' },
  { number: '50+', label: 'Trusted Brands' },
  { number: '99%', label: 'Satisfaction Rate' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-text mb-6">About Vita</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Your trusted source for premium supplements and vitamins in Morocco. 
            We import from the world's most trusted brands to support your health and wellness journey.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-bg border border-border rounded-lg shadow-soft p-12 mb-16"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text mb-6">Our Story</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Founded in 2024, VitaFlow was born from a simple mission: to make premium 
                  health supplements accessible to everyone in Morocco. We recognized the 
                  challenge of finding authentic, high-quality vitamins and supplements in 
                  the local market.
                </p>
                <p>
                  Today, we partner with renowned international brands to bring you the 
                  finest products, carefully selected for their quality, efficacy, and 
                  safety. Every product in our catalog is rigorously tested and meets 
                  international standards.
                </p>
                <p>
                  We're more than just an e-commerce platform – we're your partner in 
                  health and wellness, committed to helping you achieve your fitness and 
                  wellness goals.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-primary/10 border border-border rounded-lg flex items-center justify-center">
                <Leaf className="w-32 h-32 text-primary opacity-50" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-text text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const IconComponent = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="bg-bg border border-border rounded-lg shadow-soft p-6 text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-2">{value.title}</h3>
                  <p className="text-muted">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-primary rounded-lg shadow-soft p-12 mb-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-bg border border-border rounded-lg shadow-soft p-12 text-center"
        >
          <Users className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-text mb-4">Our Team</h2>
          <p className="text-muted max-w-2xl mx-auto">
            We're a dedicated team of health enthusiasts, nutritionists, and e-commerce 
            experts working together to bring you the best products and service. 
            Your satisfaction is our top priority.
          </p>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}

