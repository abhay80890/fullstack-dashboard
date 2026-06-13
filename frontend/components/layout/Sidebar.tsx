'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )},
  { href: '/dashboard/posts', label: 'Posts', icon: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )},
  { href: '/dashboard/products', label: 'Products', icon: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )},
  { href: '/dashboard/profile', label: 'Profile', icon: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )},
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside
      className="fixed left-0 top-0 h-full z-30 flex flex-col"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: 'var(--gradient-1)' }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-lg font-bold gradient-text">Nexus</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Main Menu</p>
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
              style={{
                background: isActive ? 'var(--accent-light)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(108,99,255,0.2)' : '1px solid transparent',
              }}
            >
              <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      {user && (
        <div className="px-4 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          {user?.role === 'ADMIN' && (
            <Link href="/dashboard/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === '/dashboard/admin' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium text-sm">Admin Panel</span>
            </Link>
          )}
          <Link href="/dashboard/profile" className="flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-white/5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'var(--accent-light)', border: '2px solid var(--border)' }}>
              {user.avatar ? (
                <Image src={`${UPLOADS_URL}${user.avatar}`} alt={user.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color: 'var(--accent)' }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
