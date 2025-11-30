'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is VitaFlow?',
        a: 'VitaFlow is Morocco\'s premier e-commerce platform for premium health supplements and vitamins. We import from trusted global brands to ensure quality and authenticity.',
      },
      {
        q: 'Are your products authentic?',
        a: 'Yes, all our products are 100% authentic. We work directly with authorized distributors and brands to ensure every product meets international quality standards.',
      },
      {
        q: 'Do you ship outside Morocco?',
        a: 'Currently, we only ship within Morocco. We\'re working on expanding our delivery network to serve customers across the country.',
      },
    ],
  },
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard delivery takes 3-5 business days, express delivery takes 1-2 business days, and store pickup is available on the same day in Casablanca.',
      },
      {
        q: 'What are the shipping costs?',
        a: 'Standard shipping is 50 MAD, express shipping is 100 MAD. We offer free shipping on orders over 300 MAD.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes, once your order is shipped, you\'ll receive a tracking number via email and SMS. You can track your order in the "My Orders" section.',
      },
      {
        q: 'What if my order is damaged?',
        a: 'Please contact us immediately with photos of the damaged items. We\'ll send a replacement at no cost within 24 hours.',
      },
    ],
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'Are your products safe?',
        a: 'All our products are tested for quality and safety. We only stock supplements from reputable brands that meet international standards and have proper certifications.',
      },
      {
        q: 'Do you have expiration dates?',
        a: 'Yes, all products clearly display expiration dates. We ensure all products have at least 6 months before expiration.',
      },
      {
        q: 'Can I see product ingredients?',
        a: 'Yes, full ingredient lists and nutritional information are available on each product detail page.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return policy for unopened products in their original packaging. Returns are free for defective or damaged items.',
      },
      {
        q: 'How do I return a product?',
        a: 'Contact our customer service team to initiate a return. We\'ll provide a return label and instructions. Once received, refunds are processed within 5-7 business days.',
      },
      {
        q: 'Can I exchange a product?',
        a: 'Yes, you can exchange products within 30 days of purchase. Contact customer service to arrange an exchange.',
      },
    ],
  },
  {
    category: 'Payment',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept credit/debit cards, bank transfers, and cash on delivery in select areas. All card transactions are secured and encrypted.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, we use industry-standard encryption and never store your full card details. All payments are processed through secure payment gateways.',
      },
      {
        q: 'Do you charge VAT?',
        a: 'Yes, all prices include 20% VAT as required by Moroccan law. The final price displayed is what you pay.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(faqs[0].category)
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-text mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted">
            Find answers to common questions about our products and services
          </p>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((category) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg border border-border rounded-lg shadow-soft overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenCategory(openCategory === category.category ? null : category.category)
                }
                className="w-full p-6 flex items-center justify-between hover:bg-bg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <h2 className="text-2xl font-bold text-text">{category.category}</h2>
                    <ChevronDown
                      className={`w-6 h-6 text-text transition-transform duration-200 ${
                        openCategory === category.category ? 'transform rotate-180' : ''
                      }`}
                    />
              </button>

              <AnimatePresence>
                {openCategory === category.category && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 space-y-4 border-t border-border">
                      {category.questions.map((faq, idx) => (
                        <div key={idx} className="border-b border-border last:border-0 pb-4 last:pb-0">
                          <button
                            onClick={() =>
                              setOpenQuestion(
                                openQuestion === `${category.category}-${idx}`
                                  ? null
                                  : `${category.category}-${idx}`
                              )
                            }
                            className="w-full flex items-center justify-between text-left py-2 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                          >
                            <span className="font-semibold text-text pr-4">{faq.q}</span>
                            <ChevronDown
                              className={`w-5 h-5 text-text flex-shrink-0 transition-transform duration-200 ${
                                openQuestion === `${category.category}-${idx}`
                                  ? 'transform rotate-180'
                                  : ''
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {openQuestion === `${category.category}-${idx}` && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="text-muted pt-2 leading-relaxed">{faq.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/10 border border-primary rounded-lg p-8 mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-text mb-4">Still have questions?</h3>
          <p className="text-muted mb-6">
            Our customer service team is here to help you 24/7
          </p>
          <a href="/contact" className="btn-primary inline-flex items-center">
            Contact Us
          </a>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}

