'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, Eye, Package, GaugeCircle, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/utils/formatters/currency';
import { getProductImage } from '@/utils/helpers/imagePlaceholder';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const getDefaultVariant = (product: Product) => {
  if (!product.variants || product.variants.length === 0) return undefined;
  return product.variants.find((variant) => variant.id === product.defaultVariantId) ?? product.variants[0];
};

const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();
  const { t } = useTranslation();
  const router = useRouter();

  const defaultVariant = getDefaultVariant(product);
  const displayPrice = defaultVariant?.price ?? product.price;
  const imageSrc = getProductImage(product);
  const isDataUri = imageSrc.startsWith('data:');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, { variant: defaultVariant });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, { variant: defaultVariant, openDrawer: false });
    router.push('/checkout');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const renderMetaBadges = (compact = false) => (
    <div className={`flex flex-wrap ${compact ? 'gap-1 text-[11px]' : 'gap-2 text-xs'} text-charcoal/60 mb-3`}>
      <span className="px-2 py-1 bg-clay-beige/30 rounded-full capitalize">{product.category}</span>
      {product.ageGroup && (
        <span className="px-2 py-1 bg-clay-beige/30 rounded-full">{product.ageGroup}</span>
      )}
      {product.gender && product.gender !== 'Unisex' && (
        <span className="px-2 py-1 bg-clay-beige/30 rounded-full">{product.gender}</span>
      )}
      {defaultVariant?.packageQuantity && (
        <span className="px-2 py-1 bg-clay-beige/30 rounded-full flex items-center space-x-1">
          <Package className="w-3 h-3" />
          <span>{defaultVariant.packageQuantity}</span>
        </span>
      )}
      {defaultVariant?.dosage && (
        <span className="px-2 py-1 bg-clay-beige/30 rounded-full flex items-center space-x-1">
          <GaugeCircle className="w-3 h-3" />
          <span>{defaultVariant.dosage}</span>
        </span>
      )}
    </div>
  );

  const renderCertifications = (compact = false) =>
    product.certifications && product.certifications.length > 0 ? (
      <div className={`flex flex-wrap ${compact ? 'gap-1 mb-3' : 'gap-2 mb-4'}`}>
        {product.certifications.slice(0, compact ? 2 : 3).map((cert) => (
          <span
            key={cert}
            className={`${compact ? 'text-[10px]' : 'text-[11px]'} uppercase tracking-wide bg-primary/10 text-primary px-2 py-1 rounded-full`}
          >
            {cert}
          </span>
        ))}
      </div>
    ) : null;

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <Link href={`/product/${product.id}`}>
          <div className="flex">
            <div className="relative w-48 h-48 flex-shrink-0 bg-white">
              {isDataUri ? (
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  sizes="192px"
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              )}

              <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-charcoal'}`} />
              </button>

              {!product.inStock && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {t('products.outOfStock')}
                </div>
              )}
            </div>

            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-charcoal/60 font-medium uppercase tracking-wide">
                    {product.brand}
                  </span>
                  <h3 className="text-xl font-semibold text-charcoal mb-2 group-hover:text-herbal-green transition-colors duration-200">
                    {product.name}
                  </h3>
                  {renderMetaBadges(true)}
                  {renderCertifications(true)}
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-charcoal/60">{product.rating}</span>
                    <span className="text-sm text-charcoal/40">({product.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-charcoal">{formatPrice(displayPrice)}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-charcoal/50 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-charcoal/70 mb-4 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {product.inStock ? (
                    <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                      {t('products.inStock')}
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full">
                      {t('products.outOfStock')}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="bg-gradient-to-br from-[#11998E] to-[#38EF7D] hover:from-[#1AB99A] hover:to-[#4DFF8F] disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('products.addToCart')}</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="bg-white text-[#11998E] border border-[#11998E] hover:bg-gradient-to-br hover:from-[#11998E] hover:to-[#38EF7D] hover:text-white disabled:bg-gray-200 disabled:text-gray-500 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-sm font-medium">Buy now</span>
                  </button>
                  <button className="p-2 border border-clay-beige rounded-lg hover:bg-clay-beige transition-colors duration-200">
                    <Eye className="w-4 h-4 text-charcoal" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-border-soft shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative px-4 pt-4">
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center text-text-muted hover:text-red-500 transition-colors duration-200"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'stroke-2'}`} />
          </button>

          {!product.inStock && (
            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              {t('products.outOfStock')}
            </div>
          )}

          <div className="relative mt-2 rounded-xl bg-[#F9FAFB] h-[140px] sm:h-[150px] md:h-[160px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-x-8 bottom-3 h-3 bg-black/10 rounded-full blur-xl opacity-20" />
            <div className="relative w-full h-[75%]">
              {isDataUri ? (
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              )}
            </div>
          </div>
        </div>

        <div className="p-3 flex flex-col gap-1.5 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-text-muted">
              {product.brand}
            </span>
            <div className="flex items-center gap-0.5 text-[10px] text-text-muted">
              <Star className="w-2.5 h-2.5 text-accent-yellow fill-accent-yellow" />
              <span className="text-[10px]">{product.rating}</span>
              <span className="text-[9px] text-text-muted opacity-70">({product.reviews})</span>
            </div>
          </div>

          <h3 className="text-xs font-semibold leading-tight line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-[#11998E] group-hover:to-[#38EF7D] group-hover:bg-clip-text group-hover:text-transparent transition-colors">
            {product.name}
          </h3>

          <p className="text-[10px] text-text-muted">{product.category}</p>

          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-text-main">{formatPrice(displayPrice)}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-text-muted line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-white border border-border-soft text-text-main hover:bg-[#F5F7FA] hover:border-[#11998E] hover:text-[#11998E] font-medium py-1.5 px-2 rounded-lg text-[10px] transition-all duration-200 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
          >
            <ShoppingCart className="w-3 h-3" />
            <span>{t('products.addToCart')}</span>
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

