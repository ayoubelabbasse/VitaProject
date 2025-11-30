'use client';

import { motion } from 'framer-motion';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

const ProductGrid = ({ products, title, subtitle }: ProductGridProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-clay-beige rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-charcoal/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">
              No products found
            </h3>
            <p className="text-charcoal/60">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid; 