'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

interface Post {
  id: string; title: string; content: string; imageUrl?: string;
  published: boolean; createdAt: string; author: { name: string; nickname?: string; avatar: string };
}

export default function ViewPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/posts/${params.id}`)
      .then(({ data }) => setPost(data.data))
      .catch(() => router.push('/dashboard/posts'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button className="btn btn-secondary btn-sm flex items-center gap-2" onClick={() => router.back()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
      </div>

      {post.imageUrl && (
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'var(--bg-secondary)' }}>
          <Image src={`${UPLOADS_URL}${post.imageUrl}`} alt={post.title} fill className="object-contain" />
        </div>
      )}

      <div className="card p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{post.title}</h1>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}>
                {post.author.nickname?.[0]?.toUpperCase() || post.author.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{post.author.nickname || post.author.name}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge ${post.published ? 'badge-green' : 'badge-orange'} px-4 py-1.5 text-sm`}>
              {post.published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{post.content}</p>
        </div>
      </div>
    </div>
  );
}
