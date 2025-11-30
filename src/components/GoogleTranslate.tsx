'use client'

import { useEffect } from 'react'

// Type declarations for Google Translate
declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new (settings: any, elementId: string): any;
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Initialize Google Translate
    const initTranslate = () => {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,fr,ar',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true,
            },
            'google_translate_element'
          )
        }
      }
    }

    // Check if already loaded
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.head.appendChild(script)

      // Initialize when script loads
      script.onload = () => {
        initTranslate()
      }
    } else {
      initTranslate()
    }

    // Cleanup
    return () => {
      const element = document.getElementById('google_translate_element')
      if (element) {
        element.innerHTML = ''
      }
    }
  }, [])

  return (
    <div 
      id="google_translate_element" 
      className="hidden md:block"
      style={{ direction: 'ltr' }}
    />
  )
}



