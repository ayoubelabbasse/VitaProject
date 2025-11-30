'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-text mb-8">Privacy Policy</h1>
        <div className="bg-bg border border-border rounded-lg shadow-soft p-8 space-y-6 text-muted leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including name, email, phone number, shipping address, and payment information when you make a purchase.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">2. How We Use Your Information</h2>
            <p>We use your information to process orders, communicate with you, improve our services, and comply with legal obligations.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">4. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. Contact us at privacy@vitaflow.ma to exercise these rights.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">5. Contact Us</h2>
            <p>For questions about this policy, contact us at privacy@vitaflow.ma</p>
          </section>
          <p className="text-sm text-muted mt-8">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

