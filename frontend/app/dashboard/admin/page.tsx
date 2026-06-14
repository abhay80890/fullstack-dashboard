'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import StatCard from '@/components/ui/StatCard';
import Image from 'next/image';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

interface Stats { totalUsers: number; totalPosts: number; totalProducts: number; }
interface RecentUser { id: string; name: string; nickname?: string; email: string; avatar?: string; role: string; createdAt: string; }
interface MonthlyUser { name: string; users: number; }
interface AdminData { stats: Stats; recentUsers: RecentUser[]; monthlyUsers: MonthlyUser[]; }

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
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      </div>
      <h2 className="text-2xl font-bold mb-2 text-white">Access Denied</h2>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>You must be an administrator to view this control panel.</p>
    </div>
  );

  const { stats, recentUsers, monthlyUsers } = data;

  const statCards = [
    { title: 'Total Registered Users', value: stats.totalUsers, icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, gradient: 'linear-gradient(135deg,#6c63ff,#a855f7)' },
    { title: 'Total Global Posts', value: stats.totalPosts, icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, gradient: 'linear-gradient(135deg,#00d4aa,#4da6ff)' },
    { title: 'Total Global Products', value: stats.totalProducts, icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, gradient: 'linear-gradient(135deg,#4da6ff,#6c63ff)' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg shadow-xl" style={{ border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold text-white mb-1">{label}</p>
          <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
            {payload[0].value} Signups
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-1">Admin Command Center</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage system resources, users, and platform data.</p>
        </div>
        <span className="hidden sm:inline-flex badge badge-purple px-4 py-2 shadow-lg shadow-purple-500/20">Administrator Privileges</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="card p-6 xl:col-span-2 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              System Users Directory
            </h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-white/5">
                <tr style={{ color: 'var(--text-secondary)' }}>
                  <th className="py-4 px-5 font-semibold text-xs uppercase tracking-wider">User</th>
                  <th className="py-4 px-5 font-semibold text-xs uppercase tracking-wider">Email Address</th>
                  <th className="py-4 px-5 font-semibold text-xs uppercase tracking-wider text-center">Role</th>
                  <th className="py-4 px-5 font-semibold text-xs uppercase tracking-wider text-right">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers.map(u => (
                  <tr key={u.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-white/10" style={{ background: 'var(--accent-light)' }}>
                          {u.avatar ? (
                            <Image src={`${UPLOADS_URL}${u.avatar}`} alt={u.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color: 'var(--accent)' }}>
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold group-hover:text-white transition-colors" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.nickname ? `@${u.nickname}` : 'No handle'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-sm" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td className="py-4 px-5 text-center">
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-purple shadow-purple-500/20' : 'badge-blue shadow-blue-500/20'} shadow-sm`}>{u.role}</span>
                    </td>
                    <td className="py-4 px-5 text-sm text-right" style={{ color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="card p-6 shadow-xl flex flex-col xl:col-span-1">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Registration Trends
          </h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyUsers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdminUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-bright)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="users" stroke="#00d4aa" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminUsers)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
