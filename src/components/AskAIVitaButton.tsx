'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const VitaAIModal = dynamic(() => import('./VitaAIModal'), {
  ssr: false,
});

const AskAIVitaButton = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#111827]"
        aria-label="Build Routine"
        disabled
      >
        <span>Build Routine · 10% OFF</span>
      </button>
    );
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#11998E] to-[#38EF7D] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#11998E]/30 focus:ring-offset-0 hover:from-[#232526] hover:to-[#414345]"
        aria-label={isArabic ? 'ابن روتينك' : 'Build your routine'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Build Routine · 10% OFF</span>
      </motion.button>

      {/* Render VitaAI modal when button is clicked */}
      <VitaAIModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AskAIVitaButton;

