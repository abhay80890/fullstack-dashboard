'use client';
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toaster';
import Image from 'next/image';
import Link from 'next/link';

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

interface Product {
  id: string; name: string; description?: string; price: number;
  stock: number; category?: string; imageUrl?: string; createdAt: string;
  createdBy: { name: string; nickname?: string };
}

const emptyForm = { name: '', description: '', price: '', stock: '', category: '' };

export default function ProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async (p = 1, q = search) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?page=${p}&limit=9&search=${q}`);
      setProducts(data.data);
      setTotalPages(data.pagination.pages || 1);
    } catch { showToast('Failed to load products', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(page, search); }, [page]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchProducts(1, search); };


  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', price: String(p.price), stock: String(p.stock), category: p.category || '' });
    setPreviewUrl(p.imageUrl ? `${UPLOADS_URL}${p.imageUrl}` : null);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setImageFile(f); setPreviewUrl(URL.createObjectURL(f)); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('stock', form.stock);
      fd.append('category', form.category);
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await api.put(`/products/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Product updated!');
      }
      setModalOpen(false);
      fetchProducts(page, search);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save product';
      showToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/products/${deleteId}`);
      showToast('Product deleted!');
      setDeleteId(null);
      fetchProducts(page, search);
    } catch { showToast('Failed to delete product', 'error'); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Products</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{products.length} items in catalog</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 sm:flex-none">
            <input id="product-search" className="input-base" style={{ width: '220px' }} placeholder="Search products…"
              value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="btn btn-secondary btn-sm">Search</button>
          </form>
          <Link id="create-product-btn" href="/dashboard/products/create" className="btn btn-primary btn-sm">
            + New Product
          </Link>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No products yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Add your first product to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="card overflow-hidden group">
              <div className="relative h-44 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                {p.imageUrl ? (
                  <Image src={`${UPLOADS_URL}${p.imageUrl}`} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl">📦</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No image</span>
                  </div>
                )}
                {p.category && (
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-blue">{p.category}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1 truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                {p.description && (
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                )}
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>By {p.createdBy?.nickname || p.createdBy?.name || 'Unknown'}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold gradient-text">${p.price.toFixed(2)}</span>
                  <span className="text-xs px-2 py-1 rounded-lg" style={{
                    background: p.stock > 0 ? 'rgba(0,212,170,0.1)' : 'rgba(255,77,109,0.1)',
                    color: p.stock > 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                  }}>
                    {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm flex-1" onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(p.id)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm transition-all ${page === i + 1 ? 'btn btn-primary' : 'btn btn-secondary'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Edit Product" size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Product Name</label>
              <input id="product-name" className="input-base" placeholder="e.g. Premium Headphones" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Price ($)</label>
              <input id="product-price" type="number" step="0.01" min="0" className="input-base" placeholder="0.00" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Stock</label>
              <input id="product-stock" type="number" min="0" className="input-base" placeholder="0" value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Category</label>
              <input id="product-category" className="input-base" placeholder="e.g. Electronics" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
              <textarea id="product-description" className="input-base" rows={previewUrl ? 2 : 4} placeholder="Product description…" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical', transition: 'all 0.3s ease' }} />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Product Image</label>
            <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors relative group"
              style={{ borderColor: previewUrl ? 'var(--accent)' : 'var(--border)' }} onClick={() => fileRef.current?.click()}>
              {previewUrl ? (
                <>
                  <div className="relative w-full h-28">
                    <Image src={previewUrl} alt="preview" fill className="object-contain rounded-lg" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-xl">
                    <span className="text-white font-medium text-sm">Click to change image</span>
                  </div>
                </>
              ) : (
                <div className="py-4">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Click to upload image</p>
                </div>
              )}
            </div>
            <input ref={fileRef} id="product-image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button id="save-product-btn" type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Update'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this product? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
