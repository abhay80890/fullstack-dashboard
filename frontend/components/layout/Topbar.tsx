'use client';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Overview', subtitle: 'Welcome back! Here\'s what\'s happening.' },
  '/dashboard/posts': { title: 'Posts', subtitle: 'Manage your blog posts and articles.' },
  '/dashboard/products': { title: 'Products', subtitle: 'Manage your product catalog.' },
  '/dashboard/profile': { title: 'Profile', subtitle: 'Manage your account settings.' },
};

export default function Topbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const info = pageTitles[pathname] || 
    (pathname.startsWith('/dashboard/posts/') ? { title: 'View Post', subtitle: 'Reading full article.' } :
    pathname.startsWith('/dashboard/products/') ? { title: 'View Product', subtitle: 'Product details.' } :
    { title: 'Dashboard', subtitle: '' });

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center justify-between px-6 py-4"
      style={{
        left: 'var(--sidebar-width)',
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        height: '72px',
      }}
    >
      <div>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{info.title}</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{info.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Greeting */}
        <span className="text-sm hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
          Hello, <strong style={{ color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</strong>
        </span>

        {/* Role badge */}
        {user?.role === 'ADMIN' && (
          <span className="badge badge-purple">Admin</span>
        )}

        {/* Logout */}
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="btn btn-secondary btn-sm flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}
