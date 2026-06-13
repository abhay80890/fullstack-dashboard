'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', nickname: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.nickname, form.email, form.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ff4d6d', '#ff8c42', '#00d4aa'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10" style={{ background: 'var(--bg-primary)' }}>
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'var(--gradient-1)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text">Nexus</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Create your account</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input id="name" type="text" className="input-base" placeholder="John Doe" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Nickname (Channel Handle)</label>
              <input id="nickname" type="text" className="input-base" placeholder="@nickname" value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input id="reg-email" type="email" className="input-base" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <input id="reg-password" type="password" className="input-base" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: i <= strength ? strengthColors[strength] : 'var(--border)' }} />
                  ))}
                  <span className="text-xs" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
              <input id="confirm-password" type="password" className="input-base" placeholder="••••••••" value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(255,77,109,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(255,77,109,0.3)' }}>
                {error}
              </div>
            )}

            <button id="register-btn" type="submit" className="btn btn-primary w-full py-3 text-base mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
