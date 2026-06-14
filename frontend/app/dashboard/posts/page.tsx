'use client';
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toaster';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

interface Post {
  id: string; title: string; content: string; imageUrl?: string;
  published: boolean; createdAt: string; author: { name: string; nickname?: string; avatar: string };
}

const emptyForm = { title: '', content: '', published: false };

export default function PostsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async (p = 1, q = search) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/posts?page=${p}&limit=8&search=${q}`);
      setPosts(data.data);
      setTotalPages(data.pagination.pages || 1);
    } catch { showToast('Failed to load posts', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(page, search); }, [page]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchPosts(1, search); };


  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({ title: p.title, content: p.content, published: p.published });
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
    if (!form.title.trim() || !form.content.trim()) { showToast('Title and content are required', 'error'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      fd.append('published', String(form.published));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await api.put(`/posts/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Post updated!');
      }
      setModalOpen(false);
      fetchPosts(page, search);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save post';
      showToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/posts/${deleteId}`);
      showToast('Post deleted!');
      setDeleteId(null);
      fetchPosts(page, search);
    } catch { showToast('Failed to delete post', 'error'); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>All Posts</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{posts.length} posts found</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 sm:flex-none">
            <input id="post-search" className="input-base" style={{ width: '220px' }} placeholder="Search posts…"
              value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="btn btn-secondary btn-sm">Search</button>
          </form>
          <Link id="create-post-btn" href="/dashboard/posts/create" className="btn btn-primary btn-sm">
            + New Post
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No posts yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Create your first post to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Post', 'Author', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-white/5 cursor-pointer" style={{ borderBottom: '1px solid var(--border)' }} onClick={() => router.push(`/dashboard/posts/${p.id}`)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                          {p.imageUrl ? (
                            <Image src={`${UPLOADS_URL}${p.imageUrl}`} alt={p.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'var(--text-muted)' }}>📄</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                          <p className="text-xs line-clamp-1 max-w-xs" style={{ color: 'var(--text-muted)' }}>{p.content}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.author.nickname || p.author.name}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.published ? 'badge-green' : 'badge-orange'}`}>{p.published ? 'Published' : 'Draft'}</span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {(user?.role === 'ADMIN' || user?.nickname === p.author.nickname || user?.name === p.author.name) && (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(p.id)}>Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 py-4" style={{ borderTop: '1px solid var(--border)' }}>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm transition-all ${page === i + 1 ? 'btn-primary btn' : 'btn btn-secondary'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Edit Post" size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Title</label>
            <input id="post-title" className="input-base" placeholder="Enter post title…" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Content</label>
            <textarea id="post-content" className="input-base" rows={previewUrl ? 3 : 6} placeholder="Write your post content…" value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })} required style={{ resize: 'vertical', transition: 'all 0.3s ease' }} />
          </div>
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Cover Image</label>
            <div
              className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors relative group"
              style={{ borderColor: previewUrl ? 'var(--accent)' : 'var(--border)' }}
              onClick={() => fileRef.current?.click()}
            >
              {previewUrl ? (
                <>
                  <div className="relative w-full h-32">
                    <Image src={previewUrl} alt="preview" fill className="object-cover rounded-lg" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-xl">
                    <span className="text-white font-medium text-sm">Click to change image</span>
                  </div>
                </>
              ) : (
                <div className="py-6">
                  <div className="text-3xl mb-2">🖼️</div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Click to upload image (max 5MB)</p>
                </div>
              )}
            </div>
            <input ref={fileRef} id="post-image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
              <div className="w-10 h-6 rounded-full transition-colors" style={{ background: form.published ? 'var(--accent)' : 'var(--border)' }}>
                <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-1 ml-1" style={{ transform: form.published ? 'translateX(16px)' : 'none' }} />
              </div>
            </label>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Publish immediately</span>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button id="save-post-btn" type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Update Post'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Post" size="sm">
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this post? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
          <button id="confirm-delete-btn" className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
