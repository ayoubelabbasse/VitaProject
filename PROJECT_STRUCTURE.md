# 📁 TAQA Project Structure

## Current Structure (Before Reorganization)

```
VitaProject/
├── public/
│   ├── assets/
│   │   ├── brand/          # Brand logos
│   │   └── hero/           # Hero images (mixed)
│   └── locales/            # i18n translations
├── src/
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   ├── data/               # Static data
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Libraries & services
│   ├── store/              # State management
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
└── prisma/                 # Database schema
```

## Proposed New Structure (Organized)

```
VitaProject/
├── public/
│   ├── images/
│   │   ├── hero/           # Hero section images
│   │   ├── products/       # Product images
│   │   ├── brand/          # Brand assets
│   │   └── common/         # Shared images
│   └── locales/            # i18n translations
├── src/
│   ├── app/                # Next.js app router (pages)
│   │   ├── (auth)/         # Auth pages group
│   │   ├── (shop)/         # Shop pages group
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── ui/             # Base UI components
│   │   ├── layout/         # Layout components
│   │   ├── product/        # Product-related components
│   │   └── common/         # Shared components
│   ├── features/           # Feature modules
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   └── admin/
│   ├── services/           # Business logic & API calls
│   │   ├── api/
│   │   ├── database/
│   │   └── storage/
│   ├── hooks/              # Custom React hooks
│   ├── store/              # State management (Zustand)
│   ├── types/              # TypeScript types & interfaces
│   ├── utils/              # Utility functions
│   │   ├── formatters/
│   │   ├── validators/
│   │   └── helpers/
│   └── constants/          # App constants
└── prisma/                 # Database schema
```

