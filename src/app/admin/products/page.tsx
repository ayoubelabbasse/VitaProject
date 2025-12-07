'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { getProductImage } from '@/utils/helpers/imagePlaceholder';
import { productCatalog } from '@/data/products';

type AdminProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  image?: string | string[] | null;
  images?: string[] | null;
  galleryImages?: string[] | null;
  inStock: boolean;
  stock?: number | null;
  weight?: number | null;
  rating?: number | null;
  reviews?: number | null;
  description?: string | null;
  benefits?: string | string[] | null;
  ingredients?: string | string[] | null;
  createdAt?: string;
};

type ProductFormState = {
  name: string;
  brand: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  inStock: boolean;
  weight: string;
  image: string;
  galleryImages: string[];
  description: string;
  rating: string;
  reviews: string;
  benefits: string;
  ingredients: string;
};

const emptyForm: ProductFormState = {
  name: '',
  brand: '',
  category: '',
  price: '',
  originalPrice: '',
  stock: '',
  inStock: true,
  weight: '',
  image: '',
  galleryImages: [],
  description: '',
  rating: '',
  reviews: '',
  benefits: '',
  ingredients: '',
};

function parseListField(value: unknown): string {
  if (!value) return '';

  if (Array.isArray(value)) {
    return value.join('\n');
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.join('\n');
      }
    } catch {
      // plain string, treat as single line
      return value;
    }
  }

  return '';
}

function toStringArray(multiline: string): string[] | undefined {
  const items = multiline
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/products');
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data.error === 'string' && data.error) ||
          `Failed to load products (status ${response.status})`;
        throw new Error(message);
      }

      setProducts(data?.products ?? []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setSelectedProduct(null);
    setForm(emptyForm);
    setIsFormOpen(true);
    setError(null);
    setSuccess(null);
  };

  const openEditForm = (product: AdminProduct) => {
    setSelectedProduct(product);
    setForm({
      name: product.name ?? '',
      brand: product.brand ?? '',
      category: product.category ?? '',
      price: product.price?.toString() ?? '',
      originalPrice: product.originalPrice?.toString() ?? '',
      stock: (product.stock ?? '').toString(),
      inStock: product.inStock ?? true,
      weight: product.weight?.toString() ?? '',
      image:
        typeof product.image === 'string'
          ? product.image
          : Array.isArray(product.image) && product.image.length > 0
          ? product.image[0]
          : '',
      galleryImages:
        Array.isArray(product.galleryImages) && product.galleryImages.length > 0
          ? product.galleryImages
          : Array.isArray(product.images)
          ? product.images.slice(1)
          : [],
      description: product.description ?? '',
      rating: product.rating?.toString() ?? '',
      reviews: product.reviews?.toString() ?? '',
      benefits: parseListField(product.benefits),
      ingredients: parseListField(product.ingredients),
    });
    setIsFormOpen(true);
    setError(null);
    setSuccess(null);
  };

  const closeForm = () => {
    if (isSubmitting) return;
    setIsFormOpen(false);
    setSelectedProduct(null);
    setForm(emptyForm);
  };

  const handleInputChange = (
    field: keyof ProductFormState,
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: any = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category.trim(),
        price: form.price ? parseFloat(form.price) : 0,
        originalPrice: form.originalPrice
          ? parseFloat(form.originalPrice)
          : undefined,
        stock: form.stock ? parseInt(form.stock, 10) : 0,
        inStock: form.inStock,
        weight: form.weight ? parseFloat(form.weight) : undefined,
        image: form.image.trim() || undefined,
        description: form.description.trim(),
        rating: form.rating ? parseFloat(form.rating) : undefined,
        reviews: form.reviews ? parseInt(form.reviews, 10) : undefined,
      };

      const benefits = toStringArray(form.benefits);
      const ingredients = toStringArray(form.ingredients);

      if (benefits) {
        payload.benefits = benefits;
      }
      if (ingredients) {
        payload.ingredients = ingredients;
      }

      const imagesPayload = [
        form.image.trim(),
        ...form.galleryImages.map((entry) => entry.trim()),
      ]
        .filter(Boolean)
        .slice(0, 8);

      if (imagesPayload.length > 0) {
        payload.images = imagesPayload;
      }

      const isEdit = Boolean(selectedProduct);
      const url = isEdit
        ? `/api/admin/products/${selectedProduct?.id}`
        : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save product');
      }

      setSuccess(
        isEdit ? 'Product updated successfully' : 'Product created successfully',
      );
      await fetchProducts();
      closeForm();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: AdminProduct) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete product');
      }

      setSuccess('Product deleted successfully');
      await fetchProducts();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product');
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    });
  }, [products, searchTerm]);

  const brandOptions = useMemo(() => {
    const set = new Set<string>();
    [...products, ...productCatalog].forEach((product) => {
      if (product.brand) {
        set.add(product.brand);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    [...products, ...productCatalog].forEach((product) => {
      if (product.category) {
        set.add(product.category);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const addGalleryImageField = () => {
    setForm((prev) => {
      if (prev.galleryImages.length >= 7) return prev;
      return { ...prev, galleryImages: [...prev.galleryImages, ''] };
    });
  };

  const updateGalleryImage = (index: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.galleryImages];
      next[index] = value;
      return { ...prev, galleryImages: next };
    });
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => {
      const next = [...prev.galleryImages];
      next.splice(index, 1);
      return { ...prev, galleryImages: next };
    });
  };

  const previewImages = useMemo(() => {
    const all = [
      form.image.trim(),
      ...form.galleryImages.map((entry) => entry.trim()),
    ].filter(Boolean);
    if (all.length === 0 && selectedProduct) {
      // fallback to currently selected product media if editing
      const primary = getProductImage({
        id: selectedProduct.id,
        image:
          selectedProduct.image ??
          (Array.isArray(selectedProduct.images) &&
          selectedProduct.images.length > 0
            ? selectedProduct.images
            : undefined),
      });
      return [primary];
    }
    return all.slice(0, 8);
  }, [form.image, form.galleryImages, selectedProduct]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Products</h1>
          <p className="text-muted mt-1">
            Manage your product catalogue, pricing and availability.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add product
        </button>
      </div>

      {(error || success) && (
        <div className="space-y-3">
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search by name, brand or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-bg text-text text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="text-sm text-muted">
          {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3" />
            <p className="text-text">Loading products...</p>
          </div>
        </div>
      ) : (
        <div className="bg-bg border border-border rounded-lg overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="w-10 h-10 text-muted/30 mx-auto mb-3" />
              <p className="text-text font-medium">No products found</p>
              <p className="text-muted text-sm mt-1">
                Try adjusting your search or add a new product.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-border/40">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-text">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-text">
                      Stock / Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-text">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const imgSrc = getProductImage({
                      id: product.id,
                      image:
                        product.image ??
                        (Array.isArray(product.images) && product.images.length > 0
                          ? product.images
                          : undefined),
                    });

                    return (
                      <tr
                        key={product.id}
                        className="border-t border-border hover:bg-border/40"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-md border border-border bg-bg overflow-hidden flex-shrink-0">
                              <img
                                src={imgSrc}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-text">{product.name}</p>
                              <p className="text-xs text-muted">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-text">
                          {product.category}
                        </td>
                        <td className="py-3 px-4 text-sm text-text">
                          {product.price.toFixed(2)} MAD
                          {product.originalPrice && (
                            <span className="ml-1 text-xs text-muted line-through">
                              {product.originalPrice.toFixed(2)} MAD
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                product.inStock
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  product.inStock ? 'bg-emerald-500' : 'bg-red-500'
                                }`}
                              />
                              {product.inStock ? 'In stock' : 'Out of stock'}
                            </span>
                            <span className="text-xs text-muted">
                              Stock: {product.stock ?? 0}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-text">
                          {product.rating?.toFixed(1) ?? '—'}{' '}
                          <span className="text-muted text-xs">
                            ({product.reviews ?? 0})
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-muted">
                          {product.createdAt
                            ? new Date(product.createdAt).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditForm(product)}
                              className="inline-flex items-center justify-center px-2 py-1 rounded-md border border-border text-text hover:bg-border/60"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="inline-flex items-center justify-center px-2 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-bg border border-border shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold text-text">
                  {selectedProduct ? 'Edit product' : 'Add product'}
                </h2>
                <p className="text-xs text-muted mt-1">
                  Images are referenced by path or URL. For static images use
                  paths like <code className="text-[11px]">/images/products/...</code>.
                </p>
              </div>
              <button
                onClick={closeForm}
                className="text-muted hover:text-text rounded-full p-1.5"
                disabled={isSubmitting}
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {previewImages.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-text mb-2">
                    Image preview (up to 8 images)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {previewImages.map((src, idx) => (
                      <div
                        key={`${src}-${idx}`}
                        className="w-14 h-14 rounded-md border border-border bg-bg overflow-hidden"
                      >
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    required
                    list="admin-brand-options"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      handleInputChange('category', e.target.value)
                    }
                    required
                    list="admin-category-options"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Price (MAD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Original price (optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) =>
                      handleInputChange('originalPrice', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Stock quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Weight (optional, e.g. 500 for 500 mg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.weight}
                    onChange={(e) =>
                      handleInputChange('weight', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2 mt-5 md:mt-7">
                  <input
                    id="inStock"
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) =>
                      handleInputChange('inStock', e.target.checked)
                    }
                    className="w-4 h-4 text-primary border-border rounded"
                  />
                  <label
                    htmlFor="inStock"
                    className="text-xs font-medium text-text"
                  >
                    Product is in stock
                  </label>
                </div>
                <div />
              </div>

              <div>
                <label className="block text-xs font-medium text-text mb-1.5">
                  Image path or URL
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="e.g. /images/products/alive-omega3-nature.jpg or https://..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-[11px] text-muted mt-1.5">
                  For best performance, upload product images under{' '}
                  <code className="text-[11px]">public/images/products</code>{' '}
                  and reference them here. Leave empty to use a generated
                  placeholder.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-text mb-1.5">
                  Additional images (up to 7 more, one path or URL per field)
                </label>
                <div className="space-y-2">
                  {form.galleryImages.map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          updateGalleryImage(index, e.target.value)
                        }
                        placeholder="/images/products/another-image.jpg"
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="px-2 py-1 text-xs rounded-lg border border-border text-text hover:bg-border/60"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {form.galleryImages.length < 7 && (
                    <button
                      type="button"
                      onClick={addGalleryImageField}
                      className="mt-1 inline-flex items-center text-xs px-3 py-1.5 rounded-lg border border-border text-text hover:bg-border/60"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add image
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Rating (0–5, optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) =>
                      handleInputChange('rating', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Reviews count (optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.reviews}
                    onChange={(e) =>
                      handleInputChange('reviews', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Benefits (one per line, optional)
                  </label>
                  <textarea
                    value={form.benefits}
                    onChange={(e) =>
                      handleInputChange('benefits', e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Ingredients (one per line, optional)
                  </label>
                  <textarea
                    value={form.ingredients}
                    onChange={(e) =>
                      handleInputChange('ingredients', e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-sm text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm rounded-lg border border-border text-text hover:bg-border/60 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting
                    ? selectedProduct
                      ? 'Saving...'
                      : 'Creating...'
                    : selectedProduct
                    ? 'Save changes'
                    : 'Create product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <datalist id="admin-brand-options">
        {brandOptions.map((brand) => (
          <option key={brand} value={brand} />
        ))}
      </datalist>
      <datalist id="admin-category-options">
        {categoryOptions.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
    </div>
  );
}


