# VitaProject - Premium Supplements E-commerce MVP

A production-ready, scalable e-commerce MVP for Morocco focused on selling imported supplements and vitamins. Built with Next.js, TypeScript, and Tailwind CSS with a distinct Moroccan design aesthetic.

## 🎯 Features

### Customer Features
- **Homepage** with animated hero section and featured products
- **Product browsing** with responsive grid layout
- **Product details** with images, pricing, and descriptions
- **Shopping cart** with persistent storage
- **Multi-language support** (English, French, Arabic)
- **Responsive design** for mobile, tablet, and desktop
- **Search functionality** (ready for implementation)

### Admin Features
- **Admin login** (basic authentication)
- **Product management** (add, edit, delete)
- **Dashboard** for overview and analytics
- **Image upload** (ready for cloud storage integration)

### Technical Features
- **Modern UI/UX** with Moroccan-inspired design
- **Light animations** using Framer Motion
- **State management** with Zustand
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Responsive design** with mobile-first approach
- **Future-ready architecture** for Stripe, Firebase, and shipping APIs

## 🎨 Design System

### Color Palette
- **Herbal Green**: `#6BBF59` - Primary brand color
- **Clay Beige**: `#F0EAD6` - Warm background color
- **Charcoal**: `#1E1E1E` - Text color
- **Mint Accent**: `#C1E1C1` - Secondary accent
- **Warm Sand**: `#E8D5B7` - Hover states
- **Deep Olive**: `#4A5D23` - Darker green variant
- **Soft Cream**: `#FDFBF7` - Light background

### Typography
- **Primary Font**: Inter (clean, modern)
- **Secondary Font**: Nunito (warm, friendly)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VitaProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
VitaProject/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Hero.tsx         # Hero section
│   │   ├── ProductCard.tsx  # Product display card
│   │   ├── ProductGrid.tsx  # Product grid layout
│   │   ├── Footer.tsx       # Site footer
│   │   └── LanguageSwitcher.tsx # Language selector
│   ├── data/               # Mock data
│   │   ├── products.json   # Product data
│   │   └── categories.json # Category data
│   ├── store/              # State management
│   │   └── cartStore.ts    # Cart state with Zustand
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Type definitions
│   └── utils/              # Utility functions
│       ├── cn.ts           # Class name utility
│       └── currency.ts     # Currency formatting
├── public/
│   └── locales/            # Translation files
│       ├── en/
│       ├── fr/
│       └── ar/
├── package.json
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
└── README.md
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Internationalization**: next-i18next (ready for implementation)

## 📦 Dependencies

### Core Dependencies
- `next`: 14.0.4
- `react`: ^18
- `react-dom`: ^18
- `typescript`: ^5

### UI & Styling
- `tailwindcss`: ^3.3.0
- `framer-motion`: ^10.16.16
- `lucide-react`: ^0.294.0
- `clsx`: ^2.0.0
- `tailwind-merge`: ^2.2.0

### State Management
- `zustand`: ^4.4.7

### Internationalization
- `next-i18next`: ^15.2.0
- `i18next`: ^23.7.6
- `react-i18next`: ^13.5.0

## 🎯 Next Steps

### Immediate Features to Add
1. **Product filtering and search**
2. **Shopping cart page**
3. **Product detail pages**
4. **Admin authentication**
5. **Admin dashboard**

### Future Integrations
1. **Payment processing** (Stripe)
2. **Database** (Firebase/Supabase)
3. **Image storage** (Cloudinary)
4. **Email service** (SendGrid)
5. **Analytics** (Google Analytics)
6. **SEO optimization**

## 🌍 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Deploy from Git

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Customization

### Colors
Update colors in `tailwind.config.js` and `src/app/globals.css`

### Fonts
Replace Google Fonts import in `src/app/globals.css`

### Animations
Modify animation settings in `tailwind.config.js` and component files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: info@vitaproject.ma
- Phone: +212 5 22 123 456

---

**Built with ❤️ in Morocco**
