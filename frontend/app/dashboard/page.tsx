'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import StatCard from '@/components/ui/StatCard';
import Image from 'next/image';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalProducts: number;
  publishedPosts: number;
}
interface RecentPost { id: string; title: string; published: boolean; imageUrl?: string; createdAt: string; author: { name: string; nickname?: string } }
interface MonthlyUser { name: string; users: number; }
interface DashData { stats: Stats; recentPosts: RecentPost[]; monthlyUsers: MonthlyUser[]; }

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
    </div>
  );

  if (!data) return (
    <div className="text-center py-12">
      <p style={{ color: 'var(--text-muted)' }}>Failed to load dashboard data. Please try again later.</p>
    </div>
  );

  const { stats, recentPosts, monthlyUsers } = data;

  const statCards = [
    { title: 'Total Posts', value: stats.totalPosts, icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, gradient: 'linear-gradient(135deg,#00d4aa,#4da6ff)' },
    { title: 'Published Posts', value: stats.publishedPosts, icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>, gradient: 'linear-gradient(135deg,#ff8c42,#ff4d6d)' },
    { title: 'Total Products', value: stats.totalProducts, icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, gradient: 'linear-gradient(135deg,#4da6ff,#6c63ff)' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg shadow-xl" style={{ border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold text-white mb-1">{label}</p>
          <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
            {payload[0].value} New Users
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-6">


        {/* Recent Posts */}
        <div className="card p-6 flex flex-col hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Recent Posts
          </h2>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {recentPosts.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No posts yet.</p>}
            {recentPosts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-white/10 transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                  {p.imageUrl ? (
                    <Image src={`${UPLOADS_URL}${p.imageUrl}`} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate group-hover:text-purple-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>by <span className="font-medium text-gray-300">{p.author.nickname || p.author.name}</span></p>
                </div>
                <span className={`badge ${p.published ? 'badge-green' : 'badge-orange'} shadow-sm`}>
                  {p.published ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
