'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toaster';
import Image from 'next/image';
import Link from 'next/link';

export default function CreateProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
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

      await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Product created successfully!');
      router.push('/dashboard/products');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create product';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products" className="btn btn-secondary btn-sm flex items-center justify-center w-8 h-8 p-0 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Create New Product</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add a new item to your catalog.</p>
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Product Name *</label>
              <input id="product-name" className="input-base" placeholder="e.g. Premium Headphones" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Price ($) *</label>
              <input id="product-price" type="number" step="0.01" min="0" className="input-base" placeholder="0.00" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Stock Available</label>
              <input id="product-stock" type="number" min="0" className="input-base" placeholder="0" value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Category</label>
              <input id="product-category" className="input-base" placeholder="e.g. Electronics, Clothing, etc." value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Detailed Description</label>
              <textarea id="product-description" className="input-base" rows={4} placeholder="Describe the product in detail..." value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Product Image</label>
            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-black/5"
              style={{ borderColor: previewUrl ? 'var(--accent)' : 'var(--border)' }} onClick={() => fileRef.current?.click()}>
              {previewUrl ? (
                <div className="relative w-full h-64">
                  <Image src={previewUrl} alt="preview" fill className="object-contain rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                    <span className="text-white font-medium px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">Click to change image</span>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <div className="text-5xl mb-4">📸</div>
                  <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Click to upload an image</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>PNG, JPG or WEBP (max 5MB)</p>
                </div>
              )}
            </div>
            <input ref={fileRef} id="product-image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 mt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <Link href="/dashboard/products" className="btn btn-secondary">Cancel</Link>
            <button id="save-product-btn" type="submit" className="btn btn-primary px-8" disabled={saving}>
              {saving ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
