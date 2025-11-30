export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  description?: string;
  dosage?: string;
  packageQuantity?: string;
  flavor?: string;
}

export type AgeGroup = 'Kids' | 'Teens' | 'Adults' | 'All Ages';
export type GenderTarget = 'Unisex' | 'Male' | 'Female';

export interface Product {
  id: string | number;
  name: string;
  brand: string;
  category: string;
  color?: string;
  colorFamily?: string;
  weight?: number;
  price: number;
  originalPrice?: number;
  image: string | string[]; // Support single image or array of images
  images?: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  benefits: string[];
  ingredients: string[];
  stock?: number;
  certifications?: string[];
  diets?: string[];
  packageQuantity?: string;
  ageGroup?: AgeGroup;
  gender?: GenderTarget;
  flavors?: string[];
  variants?: ProductVariant[];
  defaultVariantId?: string;
}

export interface Category {
  id: string;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
  };
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'customer';
}

export interface Language {
  code: string;
  name: string;
  shortName?: string;
  flag: string;
}