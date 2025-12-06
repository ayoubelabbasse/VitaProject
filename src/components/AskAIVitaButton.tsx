'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FlaskConical } from 'lucide-react'
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
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#111827]"
        aria-label="Make Your Formula"
        disabled
      >
        <FlaskConical className="w-4 h-4" />
        <span>Formula</span>
      </button>
    )
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:bg-[#1f2a35] focus:outline-none focus:ring-2 focus:ring-[#11998E]/30 focus:ring-offset-0"
        aria-label={isArabic ? 'اصنع تركيبتك' : 'Make your formula'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FlaskConical className="w-3.5 h-3.5" />
        <span>Make Your Formula</span>
      </motion.button>

      {/* Render VitaAI modal when button is clicked */}
      <VitaAIModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default AskAIVitaButton

