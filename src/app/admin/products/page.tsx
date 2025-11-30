'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Plus, Edit, Trash2, Search, X, Upload, FileText } from 'lucide-react';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  color?: string;
  colorFamily?: string;
  weight?: number;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  stock: number;
  inStock: boolean;
  rating: number;
  reviews: number;
  benefits?: string;
  ingredients?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    color: '',
    colorFamily: '',
    weight: '',
    price: '',
    originalPrice: '',
    image: '' as string | string[],
    description: '',
    stock: '',
    inStock: true,
    rating: '0',
    reviews: '0',
    benefits: [] as string[],
    ingredients: [] as string[],
  });
  const [benefitInput, setBenefitInput] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          stock: parseInt(formData.stock),
          rating: parseFloat(formData.rating),
          reviews: parseInt(formData.reviews),
        }),
      });

      if (response.ok) {
        fetchProducts();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const updateFormDataImages = (previews: string[], urls: string[]) => {
    const allImages = [...previews, ...urls.filter(url => url.trim() !== '')];
    setFormData({ ...formData, image: allImages.length === 1 ? allImages[0] : allImages });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    
    // Handle multiple images
    const productImages = typeof product.image === 'string' ? [product.image] : (product.image || []);
    setImagePreviews(productImages.filter(img => img.startsWith('data:')));
    setImageUrls(productImages.filter(img => !img.startsWith('data:')).length > 0 
      ? productImages.filter(img => !img.startsWith('data:'))
      : ['']);
    setImageFiles([]);
    
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand,
      color: product.color || '',
      colorFamily: product.colorFamily || '',
      weight: product.weight?.toString() || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      image: product.image,
      description: product.description,
      stock: product.stock.toString(),
      inStock: product.inStock,
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      benefits: product.benefits ? JSON.parse(product.benefits) : [],
      ingredients: product.ingredients ? JSON.parse(product.ingredients) : [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      brand: '',
      color: '',
      colorFamily: '',
      weight: '',
      price: '',
      originalPrice: '',
      image: '',
      description: '',
      stock: '',
      inStock: true,
      rating: '0',
      reviews: '0',
      benefits: [],
      ingredients: [],
    });
    setEditingProduct(null);
    setShowForm(false);
    setImageFiles([]);
    setImagePreviews([]);
    setImageUrls(['']);
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData({ ...formData, benefits: [...formData.benefits, benefitInput.trim()] });
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData({ ...formData, ingredients: [...formData.ingredients, ingredientInput.trim()] });
      setIngredientInput('');
    }
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  const handleCSVImport = async () => {
    if (!importFile) return;

    try {
      const text = await importFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const products = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const product: any = {};
        
        headers.forEach((header, index) => {
          const value = values[index] || '';
          if (header === 'price' || header === 'originalPrice') {
            product[header] = parseFloat(value) || 0;
          } else if (header === 'stock') {
            product[header] = parseInt(value) || 0;
            product.inStock = (parseInt(value) || 0) > 0;
          } else if (header === 'description') {
            product[header] = value.replace(/"/g, '') || '';
          } else {
            product[header] = value || '';
          }
        });

        // Set defaults
        product.rating = 0;
        product.reviews = 0;
        product.benefits = [];
        product.ingredients = [];
        if (!product.image) {
          product.image = '';
        }

        products.push(product);
      }

      // Import products one by one
      let successCount = 0;
      let errorCount = 0;

      for (const product of products) {
        try {
          const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      alert(`Import complete! ${successCount} products imported, ${errorCount} errors.`);
      setShowImportModal(false);
      setImportFile(null);
      fetchProducts();
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('Error importing CSV file. Please check the format.');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-text">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Products</h1>
          <p className="text-muted mt-2">Manage your product catalog</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-bg border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={resetForm}
                className="text-muted hover:text-text"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Color Family
                  </label>
                  <input
                    type="text"
                    value={formData.colorFamily}
                    onChange={(e) => setFormData({ ...formData, colorFamily: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Price (MAD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Original Price (MAD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Product Images (up to 6) *
                  </label>
                  <div className="space-y-3">
                    {/* Multiple File Upload */}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length + imageFiles.length > 6) {
                          alert('Maximum 6 images allowed');
                          return;
                        }
                        const newFiles = [...imageFiles, ...files.slice(0, 6 - imageFiles.length)];
                        setImageFiles(newFiles);
                        
                        // Create previews
                        const newPreviews: string[] = [];
                        newFiles.forEach((file) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            newPreviews.push(reader.result as string);
                            if (newPreviews.length === newFiles.length) {
                              setImagePreviews(newPreviews);
                              updateFormDataImages(newPreviews, imageUrls);
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-600"
                    />
                    
                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="relative w-full aspect-square border border-border rounded-lg overflow-hidden">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = imageFiles.filter((_, i) => i !== index);
                                const newPreviews = imagePreviews.filter((_, i) => i !== index);
                                setImageFiles(newFiles);
                                setImagePreviews(newPreviews);
                                updateFormDataImages(newPreviews, imageUrls);
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* URL Inputs */}
                    <div className="text-sm text-muted mb-2">
                      Or enter image URLs (up to 6):
                    </div>
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            const newUrls = [...imageUrls];
                            newUrls[index] = e.target.value;
                            setImageUrls(newUrls);
                            updateFormDataImages(imagePreviews, newUrls);
                          }}
                          placeholder={`Image ${index + 1} URL (optional)`}
                          className="flex-1 px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                        {index === imageUrls.length - 1 && imageUrls.length < 6 && (
                          <button
                            type="button"
                            onClick={() => setImageUrls([...imageUrls, ''])}
                            className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                        {imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newUrls = imageUrls.filter((_, i) => i !== index);
                              setImageUrls(newUrls);
                              updateFormDataImages(imagePreviews, newUrls);
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Rich Text Description Editor */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Description (Rich Text) *
                </label>
                <div className="bg-white">
                  {typeof window !== 'undefined' && (
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(value) => setFormData({ ...formData, description: value })}
                      className="bg-white"
                    />
                  )}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Benefits
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                    placeholder="Add a benefit"
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {benefit}
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="ml-2 text-primary hover:text-primary/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Ingredients
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                    placeholder="Add an ingredient"
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="ml-2 text-primary hover:text-primary/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-border rounded-lg text-text hover:bg-border"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2">
                  {editingProduct ? 'Update' : 'Create'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-bg border border-border rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text">Import Products from CSV</h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
                className="text-muted hover:text-text"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  CSV File *
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-600"
                />
                <p className="text-sm text-muted mt-2">
                  CSV format: name, brand, category, price, originalPrice, stock, description, image (optional)
                </p>
              </div>

              <div className="bg-bg border border-border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-text mb-2">CSV Format Example:</h3>
                <pre className="text-xs text-muted overflow-x-auto">
{`name,brand,category,price,originalPrice,stock,description,image
Vitamin D3 5000IU,Now Foods,Vitamins,89.99,120.00,100,"High-potency Vitamin D3 supplement",https://example.com/image.jpg
Omega-3 Fish Oil,Nordic Naturals,Omega-3,149.99,180.00,50,"Premium fish oil supplement",`}
                </pre>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="px-6 py-2 border border-border rounded-lg text-text hover:bg-border"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCSVImport}
                  disabled={!importFile}
                  className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="bg-bg border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-border/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Brand</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-border hover:bg-border/50">
                  <td className="py-3 px-4 text-sm text-text">{product.name}</td>
                  <td className="py-3 px-4 text-sm text-text">{product.brand}</td>
                  <td className="py-3 px-4 text-sm text-text">{product.category}</td>
                  <td className="py-3 px-4 text-sm text-text">{product.price.toFixed(2)} MAD</td>
                  <td className="py-3 px-4 text-sm text-text">{product.stock}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-primary hover:bg-primary/10 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


