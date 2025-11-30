module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'ar'],
    localeDetection: false,
  },
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
} 