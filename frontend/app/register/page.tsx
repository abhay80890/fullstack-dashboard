'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AtSign, Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', nickname: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ff4d6d', '#ff8c42', '#00d4aa'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div className="min-h-screen w-full flex bg-[#050816] overflow-hidden selection:bg-purple-500/30">
      {/* LEFT PANEL - PRODUCT SHOWCASE */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[130px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] rounded-full bg-fuchsia-600/15 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
          
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Nexus</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60 leading-[1.1] mb-6 tracking-tight">
              Start building your<br />next big thing.
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-md">
              Join thousands of creators, track your growth, and manage your products effortlessly. Setup takes less than a minute.
            </p>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring" }}
          className="relative z-10 mt-12 w-[120%] aspect-[16/10] rounded-tl-2xl rounded-tr-sm border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{ transformPerspective: 1000 }}
        >
          {/* Mockup Header */}
          <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-white/[0.01]">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
          </div>
          {/* Mockup Body */}
          <div className="flex-1 p-6 flex gap-6">
            {/* Sidebar mock */}
            <div className="w-48 space-y-3">
              <div className="h-8 rounded-lg bg-white/5 w-full" />
              <div className="h-8 rounded-lg bg-white/5 w-5/6" />
              <div className="h-8 rounded-lg bg-white/5 w-4/6" />
              <div className="h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 w-full flex items-center px-3 gap-2">
                 <BarChart3 className="w-4 h-4 text-violet-400" />
                 <div className="h-2 rounded bg-violet-400/50 w-16" />
              </div>
            </div>
            {/* Main content mock */}
            <div className="flex-1 space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 h-24 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-white/5 flex items-end p-4">
                  <div className="w-full h-1/2 bg-gradient-to-t from-violet-500/20 to-transparent rounded-t-lg" />
                </div>
                <div className="flex-1 h-24 rounded-xl bg-white/5 border border-white/5" />
                <div className="flex-1 h-24 rounded-xl bg-white/5 border border-white/5" />
              </div>
              <div className="h-48 rounded-xl bg-white/[0.03] border border-white/5 p-4 flex flex-col justify-end">
                {/* Graph bars mock */}
                <div className="flex items-end justify-between h-full w-full gap-2 opacity-40">
                  {[40, 70, 45, 90, 65, 85, 100, 60].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                      className="w-full bg-gradient-to-t from-violet-500 to-fuchsia-400 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center gap-6 text-sm text-white/40 mt-8">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> Bank-grade Security
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div>Always Free Tier</div>
        </div>
      </div>

      {/* RIGHT PANEL - REGISTER */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-md relative z-10 py-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Nexus</span>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Create an account</h2>
              <p className="text-white/50">Enter your details below to get started.</p>
            </div>

            <div className="space-y-6">
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium text-sm group">
                  <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </button>
                <button type="button" className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium text-sm group">
                  <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                  Google
                </button>
              </div>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/30 text-xs uppercase tracking-wider">or sign up with email</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70" htmlFor="name">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-violet-400 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70" htmlFor="nickname">Handle</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-violet-400 transition-colors">
                        <AtSign className="w-5 h-5" />
                      </div>
                      <input
                        id="nickname"
                        type="text"
                        required
                        placeholder="nickname"
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                        value={form.nickname}
                        onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70" htmlFor="email">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-violet-400 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70" htmlFor="password">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-violet-400 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {form.password && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-1">
                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className="flex-1 h-1.5 rounded-full transition-all duration-300"
                            style={{ background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)' }}
                          />
                        ))}
                      </div>
                      <p className="text-xs mt-1.5 text-right font-medium" style={{ color: strengthColors[strength] }}>
                        {strengthLabels[strength]} Password
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70" htmlFor="confirm-password">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-violet-400 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                      value={form.confirm}
                      onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white transition-colors focus:outline-none"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-sm text-white/50 mt-8">
                Already have an account?{' '}
                <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Sign in instead
                </Link>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
