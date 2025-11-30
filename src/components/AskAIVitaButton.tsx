'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const VitaAIModal = dynamic(() => import('./VitaAIModal'), {
  ssr: false,
})

const AskAIVitaButton = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isArabic = i18n.language === 'ar'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="relative flex items-center justify-center p-2.5 rounded-lg bg-primary/10 text-primary"
        aria-label="Ask AI Vita"
        disabled
      >
        <Sparkles className="w-5 h-5" />
      </button>
    )
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center p-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={isArabic ? 'اسأل فيتا الذكي' : 'Ask AI Vita'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-5 h-5" />
        {/* Pulse animation indicator */}
        <motion.div
          className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Render VitaAI modal when button is clicked */}
      <VitaAIModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default AskAIVitaButton

