'use client';
import { useEffect, useState, use } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

interface Product {
  id: string; name: string; description: string; price: number;
  stock: number; category: string; imageUrl?: string;
  createdAt: string; createdBy: { name: string; nickname?: string };
}

export default function ViewProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${resolvedParams.id}`)
      .then(({ data }) => setProduct(data.data))
      .catch(() => router.push('/dashboard/products'))
      .finally(() => setLoading(false));
  }, [resolvedParams.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button className="btn btn-secondary btn-sm flex items-center gap-2" onClick={() => router.back()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
      </div>

      {product.imageUrl && (
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'var(--bg-secondary)' }}>
          <Image src={`${UPLOADS_URL}${product.imageUrl}`} alt={product.name} fill className="object-contain" />
        </div>
      )}

      <div className="card p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{product.name}</h1>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold gradient-text">${product.price.toFixed(2)}</span>
              {product.category && <span className="badge badge-blue text-sm">{product.category}</span>}
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Listed by <strong style={{ color: 'var(--text-primary)' }}>{product.createdBy?.nickname || product.createdBy?.name || 'Unknown'}</strong> on {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className="px-4 py-2 rounded-xl text-sm font-semibold shadow-sm" style={{
              background: product.stock > 0 ? 'rgba(0,212,170,0.1)' : 'rgba(255,77,109,0.1)',
              color: product.stock > 0 ? 'var(--accent-green)' : 'var(--accent-red)',
              border: `1px solid ${product.stock > 0 ? 'rgba(0,212,170,0.2)' : 'rgba(255,77,109,0.2)'}`
            }}>
              {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Description</h3>
          <div className="prose prose-invert prose-lg max-w-none">
            <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
              {product.description || 'No description provided for this product.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
