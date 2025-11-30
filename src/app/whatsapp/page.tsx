'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight, Download, Smartphone } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function WhatsAppPage() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const isArabic = i18n.language === 'ar'

  useEffect(() => {
    setMounted(true)
  }, [])

  // WhatsApp redirect function
  const redirectToWhatsApp = () => {
    // WhatsApp number - replace with your actual business number (format: country code + number without +)
    // Morocco example: 212 (country) + 612345678 (number) = 212612345678
    const phoneNumber = '212612345678' // TODO: Replace with your actual WhatsApp business number
    const message = isArabic 
      ? 'مرحباً، أريد الاستفسار عن منتجات فيتا'
      : i18n.language === 'fr'
      ? 'Bonjour, je souhaite me renseigner sur les produits Vita'
      : 'Hello, I would like to inquire about Vita products'
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message)
    
    // Try to open WhatsApp app, fallback to web
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    // Open in new tab/window
    window.open(whatsappUrl, '_blank')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* WhatsApp Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-[#25D366] rounded-full flex items-center justify-center shadow-soft-lg">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            {isArabic ? 'تحدث مع فيتا' : i18n.language === 'fr' ? 'Parlez avec Vita' : 'Talk to Vita'}
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            {isArabic 
              ? 'مساحتك الآمنة للاستفسار عن منتجاتنا الصحية. نحن هنا لمساعدتك!'
              : i18n.language === 'fr'
              ? 'Votre espace sûr pour vous renseigner sur nos produits de santé. Nous sommes là pour vous aider !'
              : 'Your safe space to inquire about our health products. We\'re here to help!'}
          </p>
        </motion.div>

        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-bg border border-border rounded-2xl shadow-soft-lg p-8 mb-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-text mb-2">
              {isArabic 
                ? 'اختر طريقة التواصل'
                : i18n.language === 'fr'
                ? 'Choisissez votre méthode de contact'
                : 'Choose how to contact us'}
            </h2>
            <p className="text-muted">
              {isArabic 
                ? 'يمكنك التواصل معنا عبر تطبيق WhatsApp مباشرة'
                : i18n.language === 'fr'
                ? 'Vous pouvez nous contacter directement via l\'application WhatsApp'
                : 'You can contact us directly via the WhatsApp app'}
            </p>
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={redirectToWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-soft-lg hover:shadow-soft-md flex items-center justify-center gap-3 mb-4 group"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-lg">
              {isArabic 
                ? 'فتح WhatsApp'
                : i18n.language === 'fr'
                ? 'Ouvrir WhatsApp'
                : 'Open WhatsApp'}
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary Option */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <span>
              {isArabic 
                ? 'ليس لديك التطبيق؟'
                : i18n.language === 'fr'
                ? 'Vous n\'avez pas l\'application ?'
                : 'Don\'t have the app?'}
            </span>
            <a
              href="https://web.whatsapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline font-medium flex items-center gap-1"
            >
              <span>
                {isArabic 
                  ? 'استخدم WhatsApp Web'
                  : i18n.language === 'fr'
                  ? 'Utiliser WhatsApp Web'
                  : 'Use WhatsApp Web'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-bg border border-border rounded-xl p-6 text-center"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-text mb-2">
              {isArabic ? 'رد سريع' : i18n.language === 'fr' ? 'Réponse rapide' : 'Quick Response'}
            </h3>
            <p className="text-sm text-muted">
              {isArabic 
                ? 'نرد على استفساراتك خلال دقائق'
                : i18n.language === 'fr'
                ? 'Nous répondons à vos questions en quelques minutes'
                : 'We respond to your inquiries within minutes'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-bg border border-border rounded-xl p-6 text-center"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-text mb-2">
              {isArabic ? 'دعم متخصص' : i18n.language === 'fr' ? 'Support expert' : 'Expert Support'}
            </h3>
            <p className="text-sm text-muted">
              {isArabic 
                ? 'فريق متخصص لمساعدتك في اختيار المنتجات المناسبة'
                : i18n.language === 'fr'
                ? 'Une équipe d\'experts pour vous aider à choisir les bons produits'
                : 'Expert team to help you choose the right products'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-bg border border-border rounded-xl p-6 text-center"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-text mb-2">
              {isArabic ? 'سهل الاستخدام' : i18n.language === 'fr' ? 'Facile à utiliser' : 'Easy to Use'}
            </h3>
            <p className="text-sm text-muted">
              {isArabic 
                ? 'تواصل مباشر وسهل عبر تطبيق مألوف'
                : i18n.language === 'fr'
                ? 'Communication directe et facile via une application familière'
                : 'Direct and easy communication via a familiar app'}
            </p>
          </motion.div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-primary hover:text-primary-600 font-medium inline-flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>
              {isArabic 
                ? 'العودة للصفحة الرئيسية'
                : i18n.language === 'fr'
                ? 'Retour à l\'accueil'
                : 'Back to Home'}
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

