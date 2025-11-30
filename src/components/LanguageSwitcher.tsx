'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', shortName: 'EN', flag: '🇺🇸', googleCode: 'en' },
  { code: 'fr', name: 'Français', shortName: 'FR', flag: '🇫🇷', googleCode: 'fr' },
  { code: 'ar', name: 'العربية', shortName: 'AR', flag: '🇸🇦', googleCode: 'ar' },
];

// Initialize Google Translate
const initGoogleTranslate = () => {
  if (typeof window === 'undefined') return;
  
  // Check if already loaded
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }

  // Initialize Google Translate
  // @ts-ignore
  window.googleTranslateElementInit = () => {
    // @ts-ignore
    if (window.google && window.google.translate) {
      // @ts-ignore
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,fr,ar',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
        },
        'google_translate_element'
      );
    }
  };

  // Trigger initialization if script already loaded
  // @ts-ignore
  if (window.google && window.google.translate) {
    // @ts-ignore
    window.googleTranslateElementInit();
  }
};

// Change Google Translate language programmatically
const changeGoogleTranslateLanguage = (languageCode: string) => {
  if (typeof window === 'undefined') return;
  
  // Try multiple methods to change language
  // Method 1: Direct select element
  const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
  if (selectElement && selectElement.value !== languageCode) {
    selectElement.value = languageCode;
    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Method 2: Use Google Translate API if available
  // @ts-ignore
  if (window.google && window.google.translate) {
    try {
      // @ts-ignore
      const frame = document.querySelector('.goog-te-banner-frame');
      // @ts-ignore
      if (frame && frame.contentWindow) {
        // @ts-ignore
        const select = frame.contentWindow.document?.querySelector('.goog-te-combo');
        if (select && select.value !== languageCode) {
          select.value = languageCode;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    } catch (e) {
      // Cross-origin restrictions might prevent access
      console.log('Google Translate iframe access restricted');
    }
  }
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Initialize Google Translate on mount
    initGoogleTranslate();
  }, []);

  // Use a default language code that matches server-side rendering
  const currentLanguageCode = mounted ? (i18n.language || 'en') : 'en';
  const currentLanguage = languages.find(lang => lang.code === currentLanguageCode) || languages[0];

  // Sync Google Translate when language changes
  useEffect(() => {
    if (mounted) {
      const currentLang = languages.find(lang => lang.code === currentLanguageCode);
      if (currentLang) {
        // Small delay to ensure Google Translate is ready
        setTimeout(() => {
          changeGoogleTranslateLanguage(currentLang.googleCode);
        }, 100);
      }
    }
  }, [currentLanguageCode, mounted]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    
    // Update document direction for RTL languages
    if (languageCode === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = languageCode;
    }
    
    // Change Google Translate language
    const selectedLang = languages.find(lang => lang.code === languageCode);
    if (selectedLang) {
      changeGoogleTranslateLanguage(selectedLang.googleCode);
    }
    
    setIsOpen(false);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="relative">
        <button
          className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border"
          aria-label="Change language"
          disabled
        >
          <Globe className="w-5 h-5 text-text" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border hover:border-primary transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Change language"
      >
        <span className="text-sm font-medium text-text group-hover:text-primary transition-colors duration-200">
          {(currentLanguage.shortName ?? currentLanguage.name).toUpperCase()}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted group-hover:text-primary transition-colors duration-200" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-48 bg-bg rounded-lg shadow-soft-lg border border-border overflow-hidden z-50"
          >
            <div className="p-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-bg group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    currentLanguageCode === language.code ? 'bg-primary/10' : ''
                  }`}
                >
                  <span className="flex-1 text-left text-sm font-medium text-text group-hover:text-primary transition-colors duration-200">
                    {(language.shortName ?? language.name).toUpperCase()}
                  </span>
                  {currentLanguageCode === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Hidden Google Translate element - integrated with language switcher */}
            <div 
              id="google_translate_element" 
              className="hidden"
              style={{ direction: 'ltr' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher; 