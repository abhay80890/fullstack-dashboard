'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import StatCard from '@/components/ui/StatCard';
import Image from 'next/image';

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

interface Stats { totalUsers: number; totalPosts: number; totalProducts: number; }
interface RecentUser { id: string; name: string; nickname?: string; email: string; avatar?: string; role: string; createdAt: string; }
interface AdminData { stats: Stats; recentUsers: RecentUser[]; }

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin/stats')
      .then(r => setData(r.data.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
    </div>
  );

  if (!data) return (
    <div className="text-center py-12">
      <p style={{ color: 'var(--accent-red)' }}>Access Denied or Failed to Load</p>
      <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>You must be an admin to view this page.</p>
    </div>
  );

  const { stats, recentUsers } = data;

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, gradient: 'linear-gradient(135deg,#6c63ff,#a855f7)' },
    { title: 'Total Posts', value: stats.totalPosts, icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, gradient: 'linear-gradient(135deg,#00d4aa,#4da6ff)' },
    { title: 'Total Products', value: stats.totalProducts, icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, gradient: 'linear-gradient(135deg,#4da6ff,#6c63ff)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold gradient-text">Admin Panel</h1>
        <span className="badge badge-purple px-3 py-1">Administrator Access</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Users List */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>System Users Directory</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th className="pb-3 px-4 font-medium text-sm">User</th>
                <th className="pb-3 px-4 font-medium text-sm">Email</th>
                <th className="pb-3 px-4 font-medium text-sm">Role</th>
                <th className="pb-3 px-4 font-medium text-sm text-right">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u.id} className="group hover:bg-white/5 transition-colors border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'var(--accent-light)' }}>
                        {u.avatar ? (
                          <Image src={`${UPLOADS_URL}${u.avatar}`} alt={u.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color: 'var(--accent)' }}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.nickname ? `@${u.nickname}` : 'No handle'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td className="py-4 px-4">
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-purple' : 'badge-blue'}`}>{u.role}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-right" style={{ color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
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
