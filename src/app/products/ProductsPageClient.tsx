'use client'

import { useState, useEffect, useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Search, Filter, Zap, Heart as HeartIcon, Brain, Shield, Leaf, Pill } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Product } from '@/types'
import { productCatalog } from '@/data/products'
import ProductCard from '@/components/ProductCard'

// Simplified supplement categories - 7 main categories matching homepage
const supplementCategories = [
  { name: 'Heart Health', icon: HeartIcon, category: 'Heart Health' },
  { name: 'Brain Power', icon: Brain, category: 'Brain Health' },
  { name: 'Immune Shield', icon: Shield, category: 'Immune' },
  { name: 'Strength & Power', icon: Zap, category: 'Performance' },
  { name: 'Vitamins', icon: Pill, category: 'Vitamins' },
  { name: 'Minerals', icon: Zap, category: 'Minerals' },
  { name: 'Herbs', icon: Leaf, category: 'Herbs' }
]

// Categories will be derived dynamically from fetched products

export default function ProductsPageClient() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([])
  const [selectedDiets, setSelectedDiets] = useState<string[]>([])
  const [selectedPackageSizes, setSelectedPackageSizes] = useState<string[]>([])
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([])
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 300])
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const searchParams = useSearchParams()
  const categoryParamString = searchParams?.get('category') ?? ''

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const category = categoryParamString || undefined
        const response = await fetch(`/api/products${category ? `?category=${encodeURIComponent(category)}` : ''}`)
        const data = await response.json()
        if (data.products) {
          setProducts(data.products)
          setFilteredProducts(data.products)
        } else {
          // Fallback to static catalog if API fails
          setProducts(productCatalog)
          setFilteredProducts(productCatalog)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to static catalog
        setProducts(productCatalog)
        setFilteredProducts(productCatalog)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [categoryParamString])

  // Get unique categories from fetched products
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)))
  }, [products])

  const certificationOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((product) => {
      product.certifications?.forEach((certification) => set.add(certification))
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [products])

  const dietOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((product) => {
      product.diets?.forEach((diet) => set.add(diet))
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [products])

  const packageSizeOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((product) => {
      if (product.packageQuantity) {
        set.add(product.packageQuantity)
      }
      product.variants?.forEach((variant) => {
        if (variant.packageQuantity) {
          set.add(variant.packageQuantity)
        }
      })
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [products])

  const ageGroupOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((product) => {
      if (product.ageGroup) {
        set.add(product.ageGroup)
      }
    })
    const order = ['Kids', 'Teens', 'Adults', 'All Ages']
    return Array.from(set).sort((a, b) => {
      const indexA = order.indexOf(a)
      const indexB = order.indexOf(b)
      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b)
      }
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }, [products])

  const genderOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((product) => {
      if (product.gender) {
        set.add(product.gender)
      }
    })
    const order = ['Female', 'Male', 'Unisex']
    return Array.from(set).sort((a, b) => {
      const indexA = order.indexOf(a)
      const indexB = order.indexOf(b)
      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b)
      }
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }, [products])

  const flavorOptions = useMemo(() => {
    const set = new Set<string>()
    products.forEach((product) => {
      product.flavors?.forEach((flavor) => set.add(flavor))
      product.variants?.forEach((variant) => {
        if (variant.flavor) {
          set.add(variant.flavor)
        }
      })
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [products])

  const FilterSection = ({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-border-soft hover:border-[#11998E] transition-colors duration-200 text-xs"
        >
          <span className="text-xs font-semibold text-[#111827]">{title}</span>
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-3"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter - map display categories to actual product categories
    if (selectedCategories.length > 0) {
      // Map display category names to actual product categories
      const categoryMap: Record<string, string> = {
        'Heart Health': 'Heart Health',
        'Brain Health': 'Brain Health',
        'Immune': 'Immune',
        'Performance': 'Performance'
      };
      
      // Convert selected display categories to actual categories
      const actualCategories = selectedCategories.map(cat => categoryMap[cat] || cat);
      filtered = filtered.filter(product => actualCategories.includes(product.category))
    }

    // Availability filter - use translated strings
    if (selectedAvailability.length > 0) {
      const inStockText = t('products.inStock')
      const outOfStockText = t('products.outOfStock')
      
      if (selectedAvailability.includes(inStockText) && !selectedAvailability.includes(outOfStockText)) {
        filtered = filtered.filter(product => product.inStock)
      } else if (selectedAvailability.includes(outOfStockText) && !selectedAvailability.includes(inStockText)) {
        filtered = filtered.filter(product => !product.inStock)
      }
    }

    if (selectedCertifications.length > 0) {
      filtered = filtered.filter((product) => {
        const certifications = product.certifications ?? []
        return certifications.some((certification) => selectedCertifications.includes(certification))
      })
    }

    if (selectedDiets.length > 0) {
      filtered = filtered.filter((product) => {
        const diets = product.diets ?? []
        return diets.some((diet) => selectedDiets.includes(diet))
      })
    }

    if (selectedPackageSizes.length > 0) {
      filtered = filtered.filter((product) => {
        const packageSet = new Set<string>()
        if (product.packageQuantity) {
          packageSet.add(product.packageQuantity)
        }
        product.variants?.forEach((variant) => {
          if (variant.packageQuantity) {
            packageSet.add(variant.packageQuantity)
          }
        })
        return Array.from(packageSet).some((pkg) => selectedPackageSizes.includes(pkg))
      })
    }

    if (selectedAgeGroups.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.ageGroup) return false
        if (product.ageGroup === 'All Ages') return true
        return selectedAgeGroups.includes(product.ageGroup)
      })
    }

    if (selectedGenders.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.gender) return false
        if (product.gender === 'Unisex') {
          return selectedGenders.includes('Unisex')
        }
        return selectedGenders.includes(product.gender)
      })
    }

    if (selectedFlavors.length > 0) {
      filtered = filtered.filter((product) => {
        const flavors = new Set<string>()
        product.flavors?.forEach((flavor) => flavors.add(flavor))
        product.variants?.forEach((variant) => {
          if (variant.flavor) {
            flavors.add(variant.flavor)
          }
        })
        return Array.from(flavors).some((flavor) => selectedFlavors.includes(flavor))
      })
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order for featured
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategories, selectedAvailability, selectedCertifications, selectedDiets, selectedPackageSizes, selectedAgeGroups, selectedGenders, selectedFlavors, sortBy, priceRange, t])

  useEffect(() => {
    if (!categoryParamString) {
      return
    }

    const categoriesFromParams = categoryParamString
      .split(',')
      .map((value) => decodeURIComponent(value.trim()))
      .filter((value) => value)

    if (categoriesFromParams.length > 0) {
      setSelectedCategories(categoriesFromParams)
    }
  }, [categoryParamString])

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} MAD`
  }

  const handleCheckboxChange = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, currentValues: string[]) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter(item => item !== value))
    } else {
      setter([...currentValues, value])
    }
  }

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categoryName))
    } else {
      setSelectedCategories([...selectedCategories, categoryName])
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />
      
      <main className="bg-[#F5F7FA]">
        {/* Header Section */}
        <div className="bg-white border-b border-border-soft">
          <div className="vita-container py-6 md:py-8">
            {/* Title and Subtitle */}
            <div className="mb-6">
              <div className="flex items-baseline gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-semibold text-text-main">All Products</h1>
              </div>
              <p className="text-text-muted text-xs md:text-sm">
                Explore vitamins, minerals and supplements for every goal.
              </p>
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {supplementCategories.map((category) => {
                const IconComponent = category.icon;
                const isActive = selectedCategories.includes(category.category);
                return (
                  <motion.button
                    key={category.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCategoryClick(category.category)}
                    className={`transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
                      isActive 
                        ? 'bg-gradient-to-br from-[#11998E] to-[#38EF7D] text-white border-[#11998E]' 
                        : 'bg-white text-[#111827] border-border-soft hover:border-[#11998E] hover:text-[#11998E]'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#11998E]'}`} />
                    <span className="text-[11px] font-medium text-center leading-tight">
                      {category.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="vita-container pt-6 md:pt-8 pb-12">
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border-soft rounded-full text-sm font-medium text-text-main hover:border-[#11998E] hover:text-[#11998E] transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>{t('products.filters')}</span>
            </button>
          </div>

          {/* Results Count and Sort - iHerb Style */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-soft">
            <div className="text-sm text-text-muted">
              {(() => {
                const totalProducts = products.length
                const filteredCount = filteredProducts.length
                const start = filteredCount > 0 ? 1 : 0
                const end = filteredCount
                return `${start} - ${end} of ${totalProducts.toLocaleString()} results`
              })()}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-sm text-text-muted hidden sm:block">
                {t('productsPage.sort')}
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 md:px-4 md:py-2 border border-border-soft rounded-full focus:ring-2 focus:ring-[#11998E] bg-white text-[#111827] text-sm"
              >
                <option value="featured">{t('products.sortFeatured')}</option>
                <option value="price-low">{t('products.sortPriceLow')}</option>
                <option value="price-high">{t('products.sortPriceHigh')}</option>
                <option value="rating">{t('products.sortRating')}</option>
                <option value="name">{t('products.sortName')}</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-[240px,1fr]">
            {/* Sidebar Filters */}
            <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
              <div className="bg-white rounded-2xl shadow-md border border-border-soft p-4 md:sticky md:top-20">
                <h3 className="text-sm font-semibold text-[#111827] mb-3 flex items-baseline">
                  <Filter className="w-3.5 h-3.5 mr-2 text-[#11998E] mt-0.5" />
                  <span className="leading-none">{t('products.filters')}</span>
                </h3>

                {/* Search */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-[#111827] mb-1.5">{t('productsPage.filter')}</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('productsPage.searchPlaceholder')}
                      className="w-full pl-9 pr-3 py-1.5 border border-border-soft rounded-full focus:ring-2 focus:ring-[#11998E] focus:border-[#11998E] text-xs bg-[#F5F7FA] text-[#111827] placeholder:text-[#6B7280]"
                    />
                  </div>
                </div>

                <FilterSection title={t('products.category')} defaultOpen>
                  <div className="space-y-1.5">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCheckboxChange(category, setSelectedCategories, selectedCategories)}
                          className="mr-3 text-primary focus:ring-primary w-4 h-4"
                        />
                        <span className="text-xs text-text group-hover:text-primary transition-colors duration-200">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {(certificationOptions.length > 0 || dietOptions.length > 0) && (
                  <FilterSection title={t('products.lifestyle', { defaultValue: 'Certifications & Diets' })}>
                    <div className="space-y-4">
                      {certificationOptions.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">{t('products.certifications', 'Certifications')}</p>
                          <div className="space-y-2">
                            {certificationOptions.map((certification) => (
                              <label key={certification} className="flex items-center cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={selectedCertifications.includes(certification)}
                                  onChange={() => handleCheckboxChange(certification, setSelectedCertifications, selectedCertifications)}
                                  className="mr-3 text-primary focus:ring-primary w-4 h-4"
                                />
                                <span className="text-sm text-text group-hover:text-primary transition-colors duration-200">
                                  {certification}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                      {dietOptions.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">{t('products.diets', 'Diet Preferences')}</p>
                          <div className="space-y-2">
                            {dietOptions.map((diet) => (
                              <label key={diet} className="flex items-center cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={selectedDiets.includes(diet)}
                                  onChange={() => handleCheckboxChange(diet, setSelectedDiets, selectedDiets)}
                                  className="mr-3 text-primary focus:ring-primary w-4 h-4"
                                />
                                <span className="text-sm text-text group-hover:text-primary transition-colors duration-200">
                                  {diet}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </FilterSection>
                )}

                {(ageGroupOptions.length > 0 || genderOptions.length > 0) && (
                  <FilterSection title={t('products.audience', { defaultValue: 'Who is it for?' })}>
                    <div className="space-y-4">
                      {ageGroupOptions.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">{t('products.ageGroup', 'Age Range')}</p>
                          <div className="space-y-2">
                            {ageGroupOptions.map((ageGroup) => (
                              <label key={ageGroup} className="flex items-center cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={selectedAgeGroups.includes(ageGroup)}
                                  onChange={() => handleCheckboxChange(ageGroup, setSelectedAgeGroups, selectedAgeGroups)}
                                  className="mr-3 text-primary focus:ring-primary w-4 h-4"
                                />
                                <span className="text-sm text-text group-hover:text-primary transition-colors duration-200">
                                  {ageGroup}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                      {genderOptions.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">{t('products.gender', 'Gender')}</p>
                          <div className="space-y-2">
                            {genderOptions.map((gender) => (
                              <label key={gender} className="flex items-center cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={selectedGenders.includes(gender)}
                                  onChange={() => handleCheckboxChange(gender, setSelectedGenders, selectedGenders)}
                                  className="mr-3 text-primary focus:ring-primary w-4 h-4"
                                />
                                <span className="text-sm text-text group-hover:text-primary transition-colors duration-200">
                                  {gender}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </FilterSection>
                )}

                {(packageSizeOptions.length > 0 || flavorOptions.length > 0) && (
                  <FilterSection title={t('products.format', { defaultValue: 'Product Details' })}>
                    <div className="space-y-4">
                      {packageSizeOptions.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">{t('products.packageQuantity', 'Package')}</p>
                          <div className="space-y-2">
                            {packageSizeOptions.map((size) => (
                              <label key={size} className="flex items-center cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={selectedPackageSizes.includes(size)}
                                  onChange={() => handleCheckboxChange(size, setSelectedPackageSizes, selectedPackageSizes)}
                                  className="mr-3 text-primary focus:ring-primary w-4 h-4"
                                />
                                <span className="text-xs text-text group-hover:text-primary transition-colors duration-200">
                                  {size}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                      {flavorOptions.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">{t('products.flavors', 'Flavor')}</p>
                          <div className="space-y-2">
                            {flavorOptions.map((flavor) => (
                              <label key={flavor} className="flex items-center cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={selectedFlavors.includes(flavor)}
                                  onChange={() => handleCheckboxChange(flavor, setSelectedFlavors, selectedFlavors)}
                                  className="mr-3 text-primary focus:ring-primary w-4 h-4"
                                />
                                <span className="text-xs text-text group-hover:text-primary transition-colors duration-200">
                                  {flavor}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </FilterSection>
                )}

                <FilterSection title={t('products.availability')} defaultOpen>
                  <div className="space-y-1.5">
                    {[t('products.inStock'), t('products.outOfStock')].map((availability) => (
                      <label key={availability} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedAvailability.includes(availability)}
                          onChange={() => handleCheckboxChange(availability, setSelectedAvailability, selectedAvailability)}
                          className="mr-3 text-primary focus:ring-primary w-4 h-4"
                        />
                        <span className="text-xs text-text group-hover:text-primary transition-colors duration-200">
                          {availability}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title={t('products.price')} defaultOpen>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </FilterSection>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategories([])
                    setSelectedAvailability([])
                    setSelectedCertifications([])
                    setSelectedDiets([])
                    setSelectedPackageSizes([])
                    setSelectedAgeGroups([])
                    setSelectedGenders([])
                    setSelectedFlavors([])
                    setPriceRange([0, 300])
                  }}
                  className="w-full btn-outline"
                >
                  {t('productsPage.clearFilters')}
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="w-full">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-text mb-2">{t('products.noProductsFound')}</p>
                  <p className="text-sm text-muted">{t('products.tryAdjustingFilters')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}


