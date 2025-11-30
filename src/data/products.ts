import { Product } from '@/types';

/**
 * Centralised product catalog used across the storefront, filters and admin UI
 */

export const productCatalog: Product[] = [
  {
    id: 'now-omega-3-fish-oil',
    name: 'Omega-3 Fish Oil',
    brand: 'NOW Foods',
    category: 'Heart Health',
    price: 119.99,
    originalPrice: 139.99,
    image: '/assets/hero/88.jpeg',
    images: [
      '/assets/hero/88.jpeg'
    ],
    rating: 4.8,
    reviews: 286,
    inStock: true,
    description:
      'Molecularly distilled fish oil delivering 1,000 mg of omega-3 with EPA and DHA to support cardiovascular health, cognitive function, and joint comfort.',
    benefits: ['Cardiovascular support', 'Brain health', 'Joint comfort', 'Overall wellness'],
    ingredients: [
      'Fish Oil Concentrate (anchovy, sardine, mackerel)',
      'Softgel Capsule (gelatin, glycerin, water)',
      'Vitamin E (mixed tocopherols)'
    ],
    certifications: ['Non-GMO', 'Hexane-Free'],
    diets: ['Pescatarian', 'Keto'],
    packageQuantity: '100 Softgels',
    ageGroup: 'Adults',
    gender: 'Unisex',
    flavors: ['Neutral'],
    variants: [
      {
        id: 'now-omega-3-100',
        label: '100 Softgels • 1,000 mg',
        price: 119.99,
        dosage: '1,000 mg',
        packageQuantity: '100 Softgels'
      },
      {
        id: 'now-omega-3-200',
        label: '200 Softgels • 1,000 mg',
        price: 209.99,
        dosage: '1,000 mg',
        packageQuantity: '200 Softgels'
      }
    ],
    defaultVariantId: 'now-omega-3-100',
    stock: 75
  },
  {
    id: 'now-vitamin-d3-k2',
    name: 'Vitamin D3 & K2',
    brand: 'NOW Foods',
    category: 'Immune Support',
    price: 94.99,
    originalPrice: 109.99,
    image: '/assets/hero/132.jpeg',
    images: [
      '/assets/hero/196.jpeg'
    ],
    rating: 4.9,
    reviews: 198,
    inStock: true,
    description:
      'Balanced 1,000 IU vitamin D3 with 45 mcg vitamin K2 (MK-7) to help drive calcium into bones while supporting immune defenses and cardiovascular health.',
    benefits: ['Bone density', 'Immune resilience', 'Calcium utilization', 'Cardiovascular support'],
    ingredients: [
      'Vitamin D3 (cholecalciferol)',
      'Vitamin K2 (menaquinone-7)',
      'Sunflower Oil',
      'Softgel Capsule (bovine gelatin, glycerin, water)'
    ],
    certifications: ['Non-GMO', 'Third-Party Tested'],
    diets: ['Keto', 'Paleo'],
    packageQuantity: '120 Softgels',
    ageGroup: 'Adults',
    gender: 'Unisex',
    variants: [
      {
        id: 'now-d3k2-120',
        label: '120 Softgels • 1,000 IU / 45 mcg',
        price: 94.99,
        dosage: '1,000 IU D3 / 45 mcg K2',
        packageQuantity: '120 Softgels'
      },
      {
        id: 'now-d3k2-60',
        label: '60 Softgels • 2,000 IU / 90 mcg',
        price: 79.99,
        dosage: '2,000 IU D3 / 90 mcg K2',
        packageQuantity: '60 Softgels'
      }
    ],
    defaultVariantId: 'now-d3k2-120',
    stock: 90
  },
  {
    id: 'life-extension-magnesium-caps',
    name: 'Magnesium Caps 500 mg',
    brand: 'Life Extension',
    category: 'Minerals',
    price: 129.99,
    originalPrice: 149.99,
    image: '/assets/hero/196.jpeg',
    images: [
      '/assets/hero/204.jpeg'
    ],
    rating: 4.8,
    reviews: 164,
    inStock: true,
    description:
      'Highly bioavailable magnesium blend featuring oxide, citrate, and succinate forms to relax muscles, maintain healthy blood pressure, and support energy production.',
    benefits: ['Muscle relaxation', 'Cardiovascular health', 'Nervous system support', 'Energy metabolism'],
    ingredients: [
      'Magnesium (oxide, citrate, succinate)',
      'Vegetable Cellulose Capsule',
      'Vegetable Stearate'
    ],
    certifications: ['Non-GMO', 'Gluten-Free'],
    diets: ['Vegetarian'],
    packageQuantity: '100 Capsules',
    ageGroup: 'Adults',
    gender: 'Unisex',
    variants: [
      {
        id: 'lex-mag-100',
        label: '100 Capsules • 500 mg',
        price: 129.99,
        dosage: '500 mg',
        packageQuantity: '100 Capsules'
      },
      {
        id: 'lex-mag-250',
        label: '250 Capsules • 500 mg',
        price: 239.99,
        dosage: '500 mg',
        packageQuantity: '250 Capsules'
      }
    ],
    defaultVariantId: 'lex-mag-100',
    stock: 60
  },
  {
    id: 'now-zinc-50mg',
    name: 'Zinc 50 mg',
    brand: 'NOW Foods',
    category: 'Minerals',
    price: 74.99,
    originalPrice: 84.99,
    image: '/assets/hero/41.jpeg',
    images: [
      '/assets/hero/218.jpeg'
    ],
    rating: 4.7,
    reviews: 142,
    inStock: true,
    description:
      'Chelated zinc gluconate in vegan tablets formulated to promote immune function, collagen production, and antioxidant activity.',
    benefits: ['Immune defense', 'Skin health', 'Antioxidant support', 'Hormonal balance'],
    ingredients: [
      'Zinc (as zinc gluconate)',
      'Cellulose',
      'Stearic Acid',
      'Magnesium Stearate',
      'Silica'
    ],
    certifications: ['Vegan', 'Non-GMO'],
    diets: ['Vegan', 'Vegetarian'],
    packageQuantity: '250 Tablets',
    ageGroup: 'Adults',
    gender: 'Unisex',
    variants: [
      {
        id: 'now-zinc-250',
        label: '250 Tablets • 50 mg',
        price: 74.99,
        dosage: '50 mg',
        packageQuantity: '250 Tablets'
      },
      {
        id: 'now-zinc-100',
        label: '100 Tablets • 50 mg',
        price: 49.99,
        dosage: '50 mg',
        packageQuantity: '100 Tablets'
      }
    ],
    defaultVariantId: 'now-zinc-250',
    stock: 110
  },
  {
    id: 'now-magnesium-glycinate',
    name: 'Magnesium Glycinate',
    brand: 'NOW Foods',
    category: 'Relaxation & Sleep',
    price: 129.99,
    originalPrice: 149.99,
    image: '/assets/hero/32.jpeg',
    images: [
      '/assets/hero/32.jpeg'
    ],
    rating: 4.9,
    reviews: 214,
    inStock: true,
    description:
      'Gentle, fully chelated magnesium bisglycinate designed for superior absorption to calm the nervous system, ease muscle tension, and improve sleep quality.',
    benefits: ['Restful sleep', 'Muscle relaxation', 'Stress management', 'Nervous system balance'],
    ingredients: [
      'Magnesium (from magnesium bisglycinate)',
      'Cellulose',
      'Stearic Acid',
      'Magnesium Stearate',
      'Silica'
    ],
    certifications: ['Non-GMO', 'Vegan'],
    diets: ['Vegan', 'Gluten-Free'],
    packageQuantity: '180 Tablets',
    ageGroup: 'Adults',
    gender: 'Unisex',
    variants: [
      {
        id: 'now-mag-gly-180',
        label: '180 Tablets • 200 mg',
        price: 129.99,
        dosage: '200 mg',
        packageQuantity: '180 Tablets'
      },
      {
        id: 'now-mag-gly-90',
        label: '90 Tablets • 200 mg',
        price: 79.99,
        dosage: '200 mg',
        packageQuantity: '90 Tablets'
      }
    ],
    defaultVariantId: 'now-mag-gly-180',
    stock: 85
  },
  {
    id: 'cgn-vitamin-d3-5000',
    name: 'Vitamin D3 5,000 IU',
    brand: 'California Gold Nutrition',
    category: 'Immune Support',
    price: 84.99,
    originalPrice: 99.99,
    image: '/assets/hero/204.jpeg',
    images: [
      '/assets/hero/38.jpeg'
    ],
    rating: 4.9,
    reviews: 328,
    inStock: true,
    description:
      'High-potency vitamin D3 softgels sourced from lanolin to promote immune health, calcium absorption, and balanced mood year-round.',
    benefits: ['Immune readiness', 'Bone strength', 'Mood support', 'Hormonal balance'],
    ingredients: [
      'Vitamin D3 (cholecalciferol)',
      'Extra Virgin Olive Oil',
      'Softgel Capsule (bovine gelatin, glycerin, purified water)'
    ],
    certifications: ['cGMP Certified', 'Third-Party Tested'],
    diets: ['Keto', 'Paleo'],
    packageQuantity: '90 Softgels',
    ageGroup: 'Adults',
    gender: 'Unisex',
    variants: [
      {
        id: 'cgn-d3-90',
        label: '90 Softgels • 5,000 IU',
        price: 84.99,
        dosage: '5,000 IU',
        packageQuantity: '90 Softgels'
      },
      {
        id: 'cgn-d3-360',
        label: '360 Softgels • 5,000 IU',
        price: 249.99,
        dosage: '5,000 IU',
        packageQuantity: '360 Softgels'
      }
    ],
    defaultVariantId: 'cgn-d3-90',
    stock: 140
  },
  {
    id: 'now-iron-36mg',
    name: 'Iron 36 mg',
    brand: 'NOW Foods',
    category: 'Minerals',
    price: 92.99,
    originalPrice: 104.99,
    image: '/assets/hero/41.jpeg',
    images: [
      '/assets/hero/41.jpeg'
    ],
    rating: 4.6,
    reviews: 88,
    inStock: true,
    description:
      'Double-strength iron bisglycinate capsules delivering 36 mg elemental iron that is gentle on the stomach while replenishing energy and hemoglobin levels.',
    benefits: ['Energy production', 'Healthy hemoglobin', 'Oxygen transport', 'Prenatal support'],
    ingredients: [
      'Iron (from Ferrochel ferrous bisglycinate)',
      'Rice Flour',
      'Cellulose (capsule)',
      'Stearic Acid',
      'Silica'
    ],
    certifications: ['Non-GMO'],
    diets: ['Vegetarian'],
    packageQuantity: '90 Veg Capsules',
    ageGroup: 'Adults',
    gender: 'Unisex',
    variants: [
      {
        id: 'now-iron-90',
        label: '90 Veg Capsules • 36 mg',
        price: 92.99,
        dosage: '36 mg',
        packageQuantity: '90 Veg Capsules'
      },
      {
        id: 'now-iron-180',
        label: '180 Veg Capsules • 36 mg',
        price: 169.99,
        dosage: '36 mg',
        packageQuantity: '180 Veg Capsules'
      }
    ],
    defaultVariantId: 'now-iron-90',
    stock: 95
  },
  {
    id: 'natures-way-alive-hair-skin-nails',
    name: "Alive! Hair, Skin & Nails Gummies",
    brand: "Nature's Way",
    category: 'Beauty Nutrition',
    price: 129.99,
    originalPrice: 149.99,
    image: '/assets/hero/57.jpeg',
    images: [
      '/assets/hero/57.jpeg'
    ],
    rating: 4.7,
    reviews: 244,
    inStock: true,
    description:
      'Delicious strawberry-flavored gummies featuring biotin, collagen, and antioxidants to nourish hair, skin, and nails from the inside out.',
    benefits: ['Hair strength', 'Glowing skin', 'Nail resilience', 'Antioxidant support'],
    ingredients: [
      'Biotin',
      'Collagen',
      'Vitamin C',
      'Pectin',
      'Natural Strawberry Flavor'
    ],
    certifications: ['Gluten-Free'],
    diets: ['Vegetarian'],
    packageQuantity: '60 Gummies',
    ageGroup: 'Adults',
    gender: 'Female',
    flavors: ['Strawberry'],
    variants: [
      {
        id: 'alive-gummies-60',
        label: '60 Gummies • Strawberry',
        price: 129.99,
        flavor: 'Strawberry',
        packageQuantity: '60 Gummies'
      },
      {
        id: 'alive-gummies-120',
        label: '120 Gummies • Strawberry',
        price: 229.99,
        flavor: 'Strawberry',
        packageQuantity: '120 Gummies'
      }
    ],
    defaultVariantId: 'alive-gummies-60',
    stock: 70
  },
  {
    id: 'now-ultra-omega-3',
    name: 'Ultra Omega-3 Fish Oil',
    brand: 'NOW Foods',
    category: 'Heart Health',
    price: 159.99,
    originalPrice: 179.99,
    image: '/assets/hero/63.jpeg',
    images: [
      '/assets/hero/63.jpeg'
    ],
    rating: 4.9,
    reviews: 193,
    inStock: true,
    description:
      'Pharmaceutical-grade enteric-coated softgels with 500 EPA / 250 DHA per serving for advanced heart, brain, and eye support without fishy aftertaste.',
    benefits: ['Triglyceride balance', 'Cognitive clarity', 'Eye health', 'Anti-inflammatory response'],
    ingredients: [
      'Fish Oil Concentrate',
      'Softgel Capsule (gelatin, glycerin, water)',
      'Enteric Coating',
      'Vitamin E (mixed tocopherols)'
    ],
    certifications: ['IFOS Certified', 'Non-GMO'],
    diets: ['Pescatarian'],
    packageQuantity: '180 Softgels',
    ageGroup: 'Adults',
    gender: 'Unisex',
    variants: [
      {
        id: 'now-ultra-omega-180',
        label: '180 Softgels • 500 EPA / 250 DHA',
        price: 159.99,
        dosage: '500 EPA / 250 DHA',
        packageQuantity: '180 Softgels'
      },
      {
        id: 'now-ultra-omega-90',
        label: '90 Softgels • 500 EPA / 250 DHA',
        price: 99.99,
        dosage: '500 EPA / 250 DHA',
        packageQuantity: '90 Softgels'
      }
    ],
    defaultVariantId: 'now-ultra-omega-180',
    stock: 65
  },
  {
    id: '21st-century-potassium-gluconate',
    name: 'Potassium Gluconate 595 mg',
    brand: '21st Century',
    category: 'Minerals',
    price: 64.99,
    originalPrice: 74.99,
    image: '/assets/hero/72.jpeg',
    images: [
      '/assets/hero/72.jpeg'
    ],
    rating: 4.6,
    reviews: 156,
    inStock: true,
    description:
      'Essential mineral tablets providing 99 mg elemental potassium (from potassium gluconate) to maintain fluid balance, muscle function, and electrolyte status.',
    benefits: ['Electrolyte balance', 'Muscle function', 'Nerve transmission', 'Blood pressure support'],
    ingredients: [
      'Potassium (from potassium gluconate)',
      'Cellulose',
      'Stearic Acid',
      'Magnesium Stearate',
      'Silica'
    ],
    certifications: ['Gluten-Free'],
    diets: ['Vegetarian'],
    packageQuantity: '110 Tablets',
    ageGroup: 'Adults',
    gender: 'Unisex',
    variants: [
      {
        id: 'cen-potassium-110',
        label: '110 Tablets • 99 mg',
        price: 64.99,
        dosage: '99 mg',
        packageQuantity: '110 Tablets'
      },
      {
        id: 'cen-potassium-250',
        label: '250 Tablets • 99 mg',
        price: 109.99,
        dosage: '99 mg',
        packageQuantity: '250 Tablets'
      }
    ],
    defaultVariantId: 'cen-potassium-110',
    stock: 120
  },
  {
    id: 'swanson-ashwagandha',
    name: 'Full Spectrum Ashwagandha',
    brand: 'Swanson',
    category: 'Stress Support',
    price: 74.99,
    originalPrice: 89.99,
    image: '/assets/hero/76.jpeg',
    images: [
      '/assets/hero/76.jpeg'
    ],
    rating: 4.8,
    reviews: 176,
    inStock: true,
    description:
      'Ayurvedic adaptogen delivering 450 mg organic ashwagandha root per capsule to support stress resilience, balanced cortisol, and mental clarity.',
    benefits: ['Stress relief', 'Cortisol balance', 'Mood stability', 'Immune modulation'],
    ingredients: [
      'Organic Ashwagandha Root (Withania somnifera)',
      'Hypromellose (vegetable capsule)',
      'Rice Flour'
    ],
    certifications: ['Organic'],
    diets: ['Vegan', 'Ayurvedic'],
    packageQuantity: '100 Veg Capsules',
    ageGroup: 'Adults',
    gender: 'Unisex',
    variants: [
      {
        id: 'sws-ashwa-100',
        label: '100 Veg Capsules • 450 mg',
        price: 74.99,
        dosage: '450 mg',
        packageQuantity: '100 Veg Capsules'
      },
      {
        id: 'sws-ashwa-200',
        label: '200 Veg Capsules • 450 mg',
        price: 129.99,
        dosage: '450 mg',
        packageQuantity: '200 Veg Capsules'
      }
    ],
    defaultVariantId: 'sws-ashwa-100',
    stock: 80
  },
  {
    id: 'cgn-omega-3-premium',
    name: 'Omega-3 Premium Fish Oil',
    brand: 'California Gold Nutrition',
    category: 'Heart Health',
    price: 139.99,
    originalPrice: 159.99,
    image: '/assets/hero/218.jpeg',
    images: [
      '/assets/hero/88.jpeg'
    ],
    rating: 4.9,
    reviews: 412,
    inStock: true,
    description:
      'IFOS 5-star certified fish oil delivering 180 mg EPA and 120 mg DHA per softgel with natural lemon flavor to boost heart, brain, and immune function.',
    benefits: ['Cardiovascular health', 'Brain support', 'Immune modulation', 'Healthy inflammation response'],
    ingredients: [
      'Fish Oil Concentrate (anchovy, sardine)',
      'Softgel Capsule (bovine gelatin, glycerin, purified water)',
      'Natural Lemon Flavor',
      'Mixed Tocopherols'
    ],
    certifications: ['IFOS 5-Star', 'cGMP'],
    diets: ['Pescatarian', 'Keto'],
    packageQuantity: '100 Fish Gelatin Softgels',
    ageGroup: 'Adults',
    gender: 'Unisex',
    variants: [
      {
        id: 'cgn-omega-3-100',
        label: '100 Softgels • 180 EPA / 120 DHA',
        price: 139.99,
        dosage: '180 EPA / 120 DHA',
        packageQuantity: '100 Softgels'
      },
      {
        id: 'cgn-omega-3-240',
        label: '240 Softgels • 180 EPA / 120 DHA',
        price: 279.99,
        dosage: '180 EPA / 120 DHA',
        packageQuantity: '240 Softgels'
      }
    ],
    defaultVariantId: 'cgn-omega-3-100',
    stock: 105
  }
];
