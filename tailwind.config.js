/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium VITA Design System (CSS variables for easy theming)
        'green-main': 'var(--green-main)',
        'green-dark': 'var(--green-dark)',
        'green-soft': 'var(--green-soft)',
        'accent-yellow': 'var(--accent-yellow)',
        'bg-main': 'var(--bg-main)',
        'bg-card': 'var(--bg-card)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
        'border-soft': 'var(--border-soft)',
        // Legacy aliases / compatibility
        primary: 'var(--green-main)',
        'primary-dark': 'var(--green-dark)',
        accent: 'var(--accent-yellow)',
        border: 'var(--border-soft)',
        bg: 'var(--bg-card)',
        text: 'var(--text-main)',
        muted: 'var(--text-muted)',
        charcoal: 'var(--text-main)',
        'clay-beige': '#F3F4F6',
        'herbal-green': 'var(--green-main)',
        'deep-olive': 'var(--green-dark)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Noto Kufi Arabic', 'Cairo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 8px rgba(15, 23, 42, 0.07)',
        'soft-md': '0 8px 16px rgba(15, 23, 42, 0.07)',
        'soft-lg': '0 12px 24px rgba(15, 23, 42, 0.07)',
      },
      borderRadius: {
        'DEFAULT': '12px',
        'md': '12px',
        'lg': '16px',
      },
      spacing: {
        '18': '4.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 