'use client'

import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const WhatsAppButton = () => {
  const { i18n } = useTranslation()
  const router = useRouter()
  const isArabic = i18n.language === 'ar'

  const handleClick = () => {
    router.push('/whatsapp')
  }

  return (
    <motion.button
      onClick={handleClick}
      className="relative flex items-center justify-center p-2.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label={isArabic ? 'تواصل مع فيتا عبر واتساب' : 'Contact Vita via WhatsApp'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="w-5 h-5" />
      {/* Pulse animation indicator */}
      <motion.div
        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#25D366] rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  )
}

export default WhatsAppButton








