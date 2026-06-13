'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toaster';
import Image from 'next/image';
import Link from 'next/link';

export default function CreatePostPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [form, setForm] = useState({ title: '', content: '', published: false });
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
    if (!form.title.trim() || !form.content.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      fd.append('published', String(form.published));
      if (imageFile) fd.append('image', imageFile);

      await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Post created successfully!');
      router.push('/dashboard/posts');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create post';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/posts" className="btn btn-secondary btn-sm flex items-center justify-center w-8 h-8 p-0 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Create New Post</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Publish an update, announcement, or article.</p>
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Post Title *</label>
            <input id="post-title" className="input-base text-lg font-medium" placeholder="Give your post a catchy title..." value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Content *</label>
            <textarea id="post-content" className="input-base" rows={10} placeholder="Write your post content here..." value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })} required style={{ resize: 'vertical' }} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Cover Image</label>
            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-black/5"
              style={{ borderColor: previewUrl ? 'var(--accent)' : 'var(--border)' }} onClick={() => fileRef.current?.click()}>
              {previewUrl ? (
                <div className="relative w-full h-64">
                  <Image src={previewUrl} alt="preview" fill className="object-cover rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                    <span className="text-white font-medium px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">Click to change image</span>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <div className="text-5xl mb-4">🖼️</div>
                  <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Click to upload a cover image</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>PNG, JPG or WEBP (max 5MB)</p>
                </div>
              )}
            </div>
            <input ref={fileRef} id="post-image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="flex items-center gap-3 py-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
              <div className="w-12 h-6 rounded-full transition-colors" style={{ background: form.published ? 'var(--accent)' : 'var(--border)' }}>
                <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-1 ml-1" style={{ transform: form.published ? 'translateX(24px)' : 'none' }} />
              </div>
            </label>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Publish immediately</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>If unchecked, this post will be saved as a draft.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 mt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <Link href="/dashboard/posts" className="btn btn-secondary">Cancel</Link>
            <button id="save-post-btn" type="submit" className="btn btn-primary px-8" disabled={saving}>
              {saving ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
