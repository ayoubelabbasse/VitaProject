'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  Trash2,
  MessageCircle,
  LogOut,
  UserCircle2,
  PackageSearch,
  Heart,
  Repeat,
  Gift,
  MapPin,
  Headphones,
  LayoutDashboard,
  ClipboardList,
  Settings2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store/cartStore';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';
import AskAIVitaButton from './AskAIVitaButton';
import AddToCartDrawer from './AddToCartDrawer';
import { formatPrice } from '@/utils/currency';
import { useAuth } from '@/hooks/useAuth';
import { getProductImage } from '@/utils/imagePlaceholder';
import { productCatalog } from '@/data/products';
import type { Product } from '@/types';

const Header = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const { items, getItemCount, removeItem, getTotal } = useCartStore();

  // Get user initials
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };
  
  useEffect(() => {
    setMounted(true);
    // Sync cart with current user
    if (user) {
      const { syncWithUser } = useCartStore.getState();
      syncWithUser(user.id);
    }
  }, [user]);
  
  const itemCount = mounted ? getItemCount() : 0;

  const navItems = [
    { href: '/', label: t('nav.home'), key: 'home' },
    { href: '/products', label: t('nav.products'), key: 'products' },
    { href: '/about', label: t('nav.about'), key: 'about' },
  ];

  const supplementCollections = useMemo(() => {
    const normalizedCategories = productCatalog.reduce<Record<string, Product[]>>((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});

    return [
      {
        title: 'Supplements',
        description: 'Everyday wellness formulas and balanced stacks',
        items: [
          { label: 'Daily Multivitamins', href: '/products?category=Performance' },
          { label: 'Heart Support', href: '/products?category=Heart%20Health' },
          { label: 'Brain Focus', href: '/products?category=Brain%20Health' },
          { label: 'Immune Shield', href: '/products?category=Immune' },
        ],
      },
      {
        title: 'Vitamins',
        description: 'Targeted vitamins curated from our top sellers',
        items: [
          { label: 'Vitamin D & Sunshine Essentials', href: '/products?category=Immune' },
          { label: 'B-Complex Energy', href: '/products?category=Performance' },
          { label: 'Omega & DHA Focus', href: '/products?category=Heart%20Health' },
          { label: 'Kids & Family Vitamins', href: '/products?category=Immune' },
        ],
      },
      {
        title: 'Minerals',
        description: 'Highly absorbable minerals for balance & recovery',
        items: [
          { label: 'Magnesium Calm', href: '/products?category=Heart%20Health' },
          { label: 'Zinc Defense', href: '/products?category=Immune' },
          { label: 'Performance Electrolytes', href: '/products?category=Performance' },
          { label: 'Trace Mineral Blends', href: '/products' },
        ],
      },
    ];
  }, []);

  const customerPrimaryActions = [
    {
      href: '/account',
      label: 'Account overview',
      description: 'Profile, preferences and billing details',
      icon: UserCircle2,
    },
    {
      href: '/orders',
      label: 'Orders & returns',
      description: 'Track deliveries and manage returns',
      icon: PackageSearch,
    },
    {
      href: '/wishlist',
      label: 'Saved items',
      description: 'Build your wellness wishlist',
      icon: Heart,
    },
  ];

  const customerSecondaryActions = [
    {
      href: '/subscriptions',
      label: 'Subscriptions',
      description: 'Manage auto-refill plans',
      icon: Repeat,
    },
    {
      href: '/rewards',
      label: 'Rewards & perks',
      description: 'View Vita points and bonuses',
      icon: Gift,
    },
    {
      href: '/addresses',
      label: 'Shipping addresses',
      description: 'Update delivery locations',
      icon: MapPin,
    },
    {
      href: '/contact',
      label: 'Support centre',
      description: 'Chat with Vita Care',
      icon: Headphones,
    },
  ];

  const adminActions = [
    {
      href: '/admin',
      label: 'Admin dashboard',
      description: 'Monitor KPIs and health of the store',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/products',
      label: 'Product catalogue',
      description: 'Create, import and edit SKUs',
      icon: Settings2,
    },
    {
      href: '/admin/orders',
      label: 'Customer orders',
      description: 'Fulfil and manage purchases',
      icon: ClipboardList,
    },
  ];

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target as Node)) {
        setIsProductsMenuOpen(false);
      }
    };

    if (isCartOpen || isUserMenuOpen || isProductsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen, isUserMenuOpen, isProductsMenuOpen]);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-50 shadow-sm transition-shadow duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16 gap-3 md:gap-4">
          {/* Logo */}
          <Logo variant="wordmark" className="h-7 md:h-8 flex-shrink-0" />

          {/* Desktop Navigation - Always LTR, never flips */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6" dir="ltr" style={{ direction: 'ltr' }}>
            <div
              className="relative"
              ref={productsMenuRef}
              onMouseEnter={() => setIsProductsMenuOpen(true)}
              onMouseLeave={() => setIsProductsMenuOpen(false)}
            >
              <Link
                href="/products"
                onFocus={() => setIsProductsMenuOpen(true)}
                className="flex items-center space-x-1 text-[#111827] hover:text-[#11998E] transition-colors duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#11998E] focus:ring-offset-2 rounded px-3 py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#11998E] after:to-[#38EF7D] after:transition-all hover:after:w-full"
              >
                <span>{t('nav.products')}</span>
                <motion.span animate={{ rotate: isProductsMenuOpen ? 180 : 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.span>
              </Link>

              <AnimatePresence>
                {isProductsMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-3 w-[640px] bg-bg border border-border rounded-2xl shadow-2xl p-6 z-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">{t('nav.shopByCategory', { defaultValue: 'Shop by category' })}</p>
                        <h4 className="text-xl font-semibold text-text mt-1">{t('nav.curatedForYou', { defaultValue: 'Curated for you' })}</h4>
                      </div>
                      <Link
                        href="/products"
                        className="text-sm font-semibold text-primary hover:text-primary/80"
                        onClick={() => setIsProductsMenuOpen(false)}
                      >
                        {t('nav.viewAllProducts', { defaultValue: 'View all products' })}
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {supplementCollections.map((collection) => (
                        <div
                          key={collection.title}
                          className="bg-bg border border-border/80 rounded-xl p-5 hover:border-primary/60 transition-colors duration-200 flex flex-col"
                        >
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-text">{collection.title}</h5>
                            <p className="text-xs text-muted mt-1">{collection.description}</p>
                          </div>
                          <ul className="space-y-3 flex-1">
                            {collection.items.map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  onClick={() => setIsProductsMenuOpen(false)}
                                  className="group flex items-center justify-between text-sm text-muted hover:text-primary transition-colors duration-200 font-medium"
                                >
                                  <span className="truncate">{item.label}</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="w-3 h-3 text-muted group-hover:text-primary"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Link
                        href="/products"
                        onClick={() => setIsProductsMenuOpen(false)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                      >
                        {t('nav.viewAllProducts', { defaultValue: 'Browse all products' })}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navItems.filter((item) => item.key !== 'products').map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-text hover:text-primary transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                {item.label}
              </Link>
            ))}
            {/* Ask AI Vita Button - in navigation */}
            <div className="flex-shrink-0">
              <AskAIVitaButton />
            </div>
          </nav>

          {/* Right side items - Fixed order, never changes, always LTR */}
          <div className="flex items-center space-x-3" dir="ltr" style={{ direction: 'ltr' }}>
            {/* Search - Rounded Pill Style */}
            <div className="hidden sm:flex items-center border border-[#E5E7EB] rounded-full px-4 py-2 bg-[#F5F7FA] focus-within:ring-2 focus-within:ring-[#11998E] focus-within:border-[#11998E] transition-all h-9">
              <Search className="w-4 h-4 text-[#6B7280] mr-2" />
              <input
                type="text"
                placeholder={t('nav.search')}
                className="bg-transparent outline-none text-sm w-48 text-[#111827] placeholder:text-[#6B7280] focus:outline-none"
              />
            </div>

            {/* Language Switcher (includes Google Translate) - Fixed width to prevent layout shift */}
            <div className="flex-shrink-0 flex items-center h-9">
              <LanguageSwitcher />
            </div>

            {/* Cart Dropdown */}
            <div className="relative flex items-center h-9" ref={cartRef}>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 rounded-lg hover:bg-[#F5F7FA] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#11998E] focus:ring-offset-2"
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <ShoppingCart className="w-5 h-5 text-[#111827] hover:text-[#11998E] transition-colors duration-200" />
                {mounted && itemCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-br from-[#11998E] to-[#38EF7D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                    aria-label={`${itemCount} items in cart`}
                  >
                    {itemCount}
                  </motion.div>
                )}
              </button>

              {/* Cart Dropdown Menu */}
              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-bg border border-border rounded-lg shadow-soft-lg z-50 max-h-96 overflow-hidden flex flex-col"
                  >
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold text-text">{t('cart.title')}</h3>
                      <p className="text-sm text-muted">{itemCount} {itemCount === 1 ? t('cart.item') : t('cart.items')}</p>
                    </div>
                    
                    {items.length > 0 ? (
                      <>
                        <div className="overflow-y-auto flex-1 max-h-64">
                          <div className="p-4 space-y-3">
                            {items.map((item) => (
                              <div key={item.product.id} className="flex items-center space-x-3">
                                <div className="relative w-16 h-16 bg-bg border border-border rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={getProductImage(item.product)}
                                    alt={item.product.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text truncate">{item.product.name}</p>
                                  <p className="text-xs text-muted">Qty: {item.quantity}</p>
                                  <p className="text-sm font-semibold text-text">{formatPrice(item.product.price * item.quantity)}</p>
                                </div>
                                <button
                                  onClick={() => removeItem(Number(item.product.id))}
                                  className="p-1 text-muted hover:text-red-500 transition-colors"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 border-t border-border bg-bg">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-text">{t('cart.total')}:</span>
                            <span className="font-bold text-lg text-text">{formatPrice(getTotal())}</span>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href="/checkout"
                              onClick={() => setIsCartOpen(false)}
                              className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>{t('cart.checkout')}</span>
                            </Link>
                            <Link
                              href="/cart"
                              onClick={() => setIsCartOpen(false)}
                              className="flex-1 bg-white border border-border text-text hover:bg-gray-50 hover:border-primary hover:text-primary flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200"
                            >
                              <span>{t('cart.viewCart')}</span>
                            </Link>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-center">
                        <ShoppingCart className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                        <p className="text-muted text-sm">{t('cart.empty')}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu / Login */}
            {!authLoading && (
              <>
                {user ? (
                  <div className="hidden sm:block relative flex items-center h-9" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-bg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="User menu"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                        {getUserInitials(user.firstName, user.lastName)}
                      </div>
                      <span className="text-sm font-medium text-text hidden lg:block">
                        {user.role === 'admin' ? 'Admin' : getUserInitials(user.firstName, user.lastName)}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-[24rem] bg-bg border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="p-5 border-b border-border/70 bg-gradient-to-br from-primary/5 via-bg to-bg">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-base font-semibold">
                                {getUserInitials(user.firstName, user.lastName)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-text truncate">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-muted truncate">{user.email}</p>
                                <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                                  {user.role === 'admin' ? 'Admin access' : 'Vita member'}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                              <Link
                                href="/account"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border hover:border-primary hover:text-primary transition-all duration-200"
                              >
                                <UserCircle2 className="w-4 h-4" />
                                Manage account
                              </Link>
                              <Link
                                href="/checkout"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-200"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Checkout
                              </Link>
                            </div>
                          </div>

                          {user.role === 'admin' && (
                            <div className="px-5 py-4 border-b border-border/70 bg-bg">
                              <p className="text-[11px] uppercase tracking-wide text-muted mb-3">Admin tools</p>
                              <div className="space-y-2">
                                {adminActions.map((action) => {
                                  const IconComponent = action.icon;
                                  return (
                                    <Link
                                      key={action.href}
                                      href={action.href}
                                      onClick={() => setIsUserMenuOpen(false)}
                                      className="flex items-start gap-3 rounded-xl border border-border/70 hover:border-primary hover:bg-primary/5 transition-all duration-200 px-3 py-2.5"
                                    >
                                      <span className="mt-0.5 text-primary">
                                        <IconComponent className="w-4 h-4" />
                                      </span>
                                      <span className="flex-1">
                                        <span className="block text-xs font-semibold text-text">{action.label}</span>
                                        <span className="block text-[11px] text-muted">{action.description}</span>
                                      </span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            <div className="px-5 py-4 space-y-2 border-b border-border/70 md:border-b-0 md:border-r border-r-border/70">
                              <p className="text-[11px] uppercase tracking-wide text-muted">Your essentials</p>
                              {customerPrimaryActions.map((action) => {
                                const IconComponent = action.icon;
                                return (
                                  <Link
                                    key={action.href}
                                    href={action.href}
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="flex items-start gap-3 rounded-xl hover:bg-primary/5 transition-all duration-200 px-3 py-2"
                                  >
                                    <span className="mt-0.5 text-primary">
                                      <IconComponent className="w-4 h-4" />
                                    </span>
                                    <span className="flex-1">
                                      <span className="block text-xs font-semibold text-text">{action.label}</span>
                                      <span className="block text-[11px] text-muted">{action.description}</span>
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                            <div className="px-5 py-4 space-y-2">
                              <p className="text-[11px] uppercase tracking-wide text-muted">More from Vita</p>
                              {customerSecondaryActions.map((action) => {
                                const IconComponent = action.icon;
                                return (
                                  <Link
                                    key={action.href}
                                    href={action.href}
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="flex items-start gap-3 rounded-xl hover:bg-primary/5 transition-all duration-200 px-3 py-2"
                                  >
                                    <span className="mt-0.5 text-primary">
                                      <IconComponent className="w-4 h-4" />
                                    </span>
                                    <span className="flex-1">
                                      <span className="block text-xs font-semibold text-text">{action.label}</span>
                                      <span className="block text-[11px] text-muted">{action.description}</span>
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>

                          <div className="px-5 py-4 border-t border-border/70 bg-bg flex flex-col gap-3">
                            <div className="flex gap-2">
                              <Link
                                href="/cart"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border hover:border-primary transition-all duration-200"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                View cart
                              </Link>
                              <Link
                                href="/orders"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border hover:border-primary transition-all duration-200"
                              >
                                <PackageSearch className="w-4 h-4" />
                                Track orders
                              </Link>
                            </div>
                            <button
                              onClick={handleLogout}
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center text-text hover:text-primary transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-bg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 h-9"
                    aria-label={t('nav.login')}
                  >
                    <User className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{t('nav.login')}</span>
                  </Link>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-text" />
              ) : (
                <Menu className="w-6 h-6 text-text" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border"
            >
              <div className="py-4 space-y-4">
                {/* Mobile Search */}
                <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-bg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                  <Search className="w-4 h-4 text-muted mr-2" />
                  <input
                    type="text"
                    placeholder={t('nav.search')}
                    className="bg-transparent outline-none text-sm flex-1 text-text placeholder:text-muted focus:outline-none"
                  />
                </div>

                {/* Mobile Nav Items */}
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-text hover:text-primary transition-colors duration-200 font-medium py-2 rounded-lg px-2 hover:bg-bg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile WhatsApp Button */}
                <Link
                  href="/whatsapp"
                  className="flex items-center gap-2 text-text hover:text-primary transition-colors duration-200 font-medium py-2 rounded-lg px-2 hover:bg-bg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span>WhatsApp</span>
                </Link>

                {/* Mobile Login/User Menu */}
                {!authLoading && (
                  <>
                    {user ? (
                      <>
                        <div className="px-2 py-3 border-t border-border">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                              {getUserInitials(user.firstName, user.lastName)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-muted">{user.email}</p>
                            </div>
                          </div>
                          {user.role === 'admin' && (
                            <div className="mt-3 space-y-2">
                              <p className="text-[11px] uppercase tracking-wide text-muted px-1">Admin tools</p>
                              {adminActions.map((action) => {
                                const IconComponent = action.icon;
                                return (
                                  <Link
                                    key={action.href}
                                    href={action.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-start gap-3 px-3 py-2 rounded-lg border border-border/70 hover:border-primary hover:bg-primary/5 transition-all text-sm"
                                  >
                                    <IconComponent className="w-4 h-4 text-primary mt-0.5" />
                                    <div>
                                      <p className="font-semibold text-text text-xs">{action.label}</p>
                                      <p className="text-[11px] text-muted">{action.description}</p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          )}

                          <div className="mt-3 space-y-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted px-1">Your essentials</p>
                            {customerPrimaryActions.map((action) => {
                              const IconComponent = action.icon;
                              return (
                                <Link
                                  key={action.href}
                                  href={action.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition-all text-sm"
                                >
                                  <IconComponent className="w-4 h-4 text-primary mt-0.5" />
                                  <div>
                                    <p className="font-semibold text-text text-xs">{action.label}</p>
                                    <p className="text-[11px] text-muted">{action.description}</p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          <div className="mt-3 space-y-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted px-1">More from Vita</p>
                            {customerSecondaryActions.map((action) => {
                              const IconComponent = action.icon;
                              return (
                                <Link
                                  key={action.href}
                                  href={action.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition-all text-sm"
                                >
                                  <IconComponent className="w-4 h-4 text-primary mt-0.5" />
                                  <div>
                                    <p className="font-semibold text-text text-xs">{action.label}</p>
                                    <p className="text-[11px] text-muted">{action.description}</p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <Link
                              href="/cart"
                              onClick={() => setIsMenuOpen(false)}
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-border"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Cart
                            </Link>
                            <Link
                              href="/checkout"
                              onClick={() => setIsMenuOpen(false)}
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white"
                            >
                              Checkout
                            </Link>
                          </div>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center space-x-2 px-2 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        className="flex items-center text-text hover:text-primary transition-colors duration-200 font-medium py-2 w-full text-left rounded-lg px-2 hover:bg-bg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5 mr-2" />
                        {t('nav.login')}
                      </Link>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
    <AddToCartDrawer />
    </>
  );
};

export default Header; 