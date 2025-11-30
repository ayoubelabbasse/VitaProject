import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files directly
import enCommon from '../../public/locales/en/common.json'
import frCommon from '../../public/locales/fr/common.json'
import arCommon from '../../public/locales/ar/common.json'

const resources = {
  en: {
    common: enCommon
  },
  fr: {
    common: frCommon
  },
  ar: {
    common: arCommon
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    defaultNS: 'common',
    ns: ['common'],
  })

export default i18n 