'use client';

import React, { useState, useEffect } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import { Product } from '@/lib/data';
import { Plus, Trash2, Edit, Upload, X, Search, RefreshCw } from 'lucide-react';

// Module level cache for instant tab switching
let cachedAdminProductsList: Product[] = [];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kun_cached_products');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return cachedAdminProductsList;
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Form state for Add/Edit
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Necklaces');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Variants Fields
  const [variantName, setVariantName] = useState('Color');
  const [variantOptions, setVariantOptions] = useState('');
  const [variantsList, setVariantsList] = useState<{ name: string; options: string[] }[]>([]);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data: Product[] = await res.json();
        cachedAdminProductsList = data;
        setProducts(data);
        localStorage.setItem('kun_cached_products', JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openNewModal = () => {
    setEditingProduct(null);
    setTitle('');
    setPrice('');
    setOriginalPrice('');
    setCategory('Necklaces');
    setDescription('');
    setImages([]);
    setImageUrlInput('');
    setInStock(true);
    setFeatured(false);
    setVariantsList([]);
    setShowModal(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setPrice(prod.price.toString());
    setOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : '');
    setCategory(prod.category);
    setDescription(prod.description || '');
    setImages(prod.images || []);
    setImageUrlInput('');
    setInStock(prod.inStock);
    setFeatured(Boolean(prod.featured));
    setVariantsList(prod.variants || []);
    setShowModal(true);
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setImages(prev => [...prev, data.url]);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    if (!variantOptions.trim()) return;
    const opts = variantOptions.split(',').map(s => s.trim()).filter(Boolean);
    if (opts.length === 0) return;

    setVariantsList(prev => [...prev, { name: variantName, options: opts }]);
    setVariantOptions('');
  };

  const handleRemoveVariant = (index: number) => {
    setVariantsList(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Product Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        description: description.trim(),
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
        inStock,
        variants: variantsList,
        featured
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-100">
        <AdminNavbar />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Product Management</h1>
              <p className="text-xs text-gray-500 mt-0.5">Add new products, edit pricing, or toggle stock availability.</p>
            </div>

            <button
              onClick={openNewModal}
              className="px-5 py-3 bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Plus size={18} />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm focus:outline-none"
            />
          </div>

          {/* Product Table List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-sm text-slate-900">
              Product Catalog ({filtered.length})
            </div>

            <div className="overflow-x-auto">
              {loading && products.length === 0 ? (
                <div className="p-12 text-center text-gray-500 text-xs font-medium flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin text-pink-500" />
                  <span>Loading products catalog...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-xs font-medium">
                  No products found. Click "Add New Product" to create your first item.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase font-bold text-[11px] border-b border-gray-200">
                      <th className="p-4">Image</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (৳)</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filtered.map((prod) => (
                      <tr key={prod.id} className="hover:bg-pink-50/40 transition-colors">
                        <td className="p-4">
                          <img
                            src={prod.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                            alt={prod.title}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                        </td>
                        <td className="p-4 font-bold text-slate-900 max-w-xs">{prod.title}</td>
                        <td className="p-4"><span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold">{prod.category}</span></td>
                        <td className="p-4 font-extrabold text-slate-900">৳{prod.price}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            prod.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {prod.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </main>

        {/* Add / Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-pink-100">
              
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <h2 className="font-extrabold text-lg">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-white/20">
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left max-h-[80vh] overflow-y-auto">
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KUN Golden Butterfly Pendant Necklace"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Price (BDT ৳) *</label>
                    <input
                      type="number"
                      required
                      placeholder="890"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Original Price (BDT ৳ - Optional)</label>
                    <input
                      type="number"
                      placeholder="1200"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    list="category-suggestions"
                    placeholder="Type or select category (e.g. Necklaces, Rings, Anklets, Combos...)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-pink-500"
                  />
                  <datalist id="category-suggestions">
                    {Array.from(new Set(['Necklaces', 'Rings', 'Bracelets', 'Earrings', 'Jewellery Sets', ...products.map(p => p.category)])).map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Enter product details, material, care instructions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Product Images Management */}
                <div className="space-y-2 border-t border-b border-gray-100 py-3">
                  <label className="block text-xs font-bold text-gray-700">Product Images</label>
                  
                  {/* Upload File button */}
                  <div className="flex gap-2">
                    <label className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-2">
                      <Upload size={16} />
                      <span>{uploading ? 'Uploading Image...' : 'Upload Image File'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" disabled={uploading} />
                    </label>
                  </div>

                  {/* OR Image URL Input */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="url"
                      placeholder="Or paste Image URL link..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl"
                    >
                      Add Link
                    </button>
                  </div>

                  {/* Image Thumbnails preview */}
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full shadow"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Variants Section */}
                <div className="space-y-2 border-b border-gray-100 pb-3">
                  <label className="block text-xs font-bold text-gray-700">Product Variants (Color, Size)</label>
                  <div className="flex gap-2">
                    <select
                      value={variantName}
                      onChange={(e) => setVariantName(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-xl text-xs"
                    >
                      <option value="Color">Color</option>
                      <option value="Ring Size">Ring Size</option>
                      <option value="Finish">Finish</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Separate options with comma, e.g. Gold, Silver"
                      value={variantOptions}
                      onChange={(e) => setVariantOptions(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-3 py-2 bg-pink-50 text-pink-600 border border-pink-200 font-bold text-xs rounded-xl"
                    >
                      + Add
                    </button>
                  </div>

                  {/* Added Variants List */}
                  {variantsList.map((v, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg text-xs">
                      <span><b>{v.name}:</b> {v.options.join(', ')}</span>
                      <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-rose-600 font-bold">Delete</button>
                    </div>
                  ))}
                </div>

                {/* Toggles */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded"
                    />
                    <span>In Stock Available</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded"
                    />
                    <span>Hot / Featured Collection</span>
                  </label>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-pink-500/25 active:scale-98"
                  >
                    {submitting ? 'Saving Product...' : (editingProduct ? 'Update Product' : 'Publish Product')}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </AdminAuthGuard>
  );
}
