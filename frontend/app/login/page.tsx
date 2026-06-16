'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Shield, BarChart3, LayoutDashboard, FileText, ShoppingBag } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#050816] overflow-hidden selection:bg-purple-500/30">
      {/* LEFT PANEL - PRODUCT SHOWCASE */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[55%] relative flex-col justify-between p-12 lg:p-16 xl:pl-20 xl:py-24 overflow-hidden border-r border-white/5">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[130px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] rounded-full bg-fuchsia-600/15 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
          
          {/* subtle grid */}
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
            className="max-w-[560px]"
          >
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60 leading-[1.15] mb-6 tracking-tight">
              Manage Everything<br />From One Dashboard.
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-md">
              Streamline your workflow, track analytics in real-time, and scale your business with our premium toolset.
            </p>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring" }}
          className="relative z-10 mt-16 w-[120%] aspect-[16/10] rounded-tl-3xl rounded-tr-sm border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-[0_0_50px_rgba(139,92,246,0.1)] overflow-hidden flex flex-col"
          style={{ transformPerspective: 1000 }}
        >
          {/* Inner Glow Border */}
          <div className="absolute inset-0 border border-white/5 rounded-tl-3xl rounded-tr-sm pointer-events-none" />
          {/* Mockup Header (SaaS Topbar) */}
          <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-violet-500/50" />
              <div className="w-16 h-3 rounded-md bg-white/10" />
            </div>
            <div className="w-32 h-5 rounded-md bg-white/5" />
            <div className="w-6 h-6 rounded-full bg-white/10" />
          </div>
          {/* Mockup Body */}
          <div className="flex-1 p-6 flex gap-6">
            {/* Sidebar mock */}
            <div className="w-48 flex flex-col gap-2">
              <div className="h-8 rounded-lg bg-white/5 w-full flex items-center px-3 gap-3">
                 <LayoutDashboard className="w-4 h-4 text-white/40" />
                 <span className="text-xs font-medium text-white/50">Overview</span>
              </div>
              <div className="h-8 rounded-lg bg-white/5 w-full flex items-center px-3 gap-3">
                 <FileText className="w-4 h-4 text-white/40" />
                 <span className="text-xs font-medium text-white/50">Posts</span>
              </div>
              <div className="h-8 rounded-lg bg-white/5 w-full flex items-center px-3 gap-3">
                 <ShoppingBag className="w-4 h-4 text-white/40" />
                 <span className="text-xs font-medium text-white/50">Products</span>
              </div>
              <div className="h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 w-full flex items-center px-3 gap-3 mt-4">
                 <BarChart3 className="w-4 h-4 text-violet-400" />
                 <span className="text-xs font-medium text-violet-400">Analytics</span>
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
                  {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
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
            <Shield className="w-4 h-4" /> Secure Authentication
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div>Enterprise Grade</div>
        </div>
      </div>

      {/* RIGHT PANEL - LOGIN */}
      <div className="w-full lg:w-[45%] xl:w-[45%] flex items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-24 relative overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-[480px] bg-white/[0.02] border border-white/5 p-8 sm:p-10 lg:p-12 rounded-3xl relative z-10 shadow-2xl backdrop-blur-sm">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile Logo (hidden on desktop) */}
            <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Nexus</span>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Welcome back</h2>
              <p className="text-white/50 text-base">Enter your credentials to access your workspace.</p>
            </div>

            <div>
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button type="button" className="flex items-center justify-center gap-2 h-14 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium text-sm group">
                  <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </button>
                <button type="button" className="flex items-center justify-center gap-2 h-14 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium text-sm group">
                  <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                  Google
                </button>
              </div>

              <div className="relative flex items-center mb-8">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/30 text-xs uppercase tracking-wider">or continue with email</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70" htmlFor="email">Email Address</label>
                  <div className="flex items-center h-14 w-full rounded-xl bg-white/5 border border-white/10 overflow-hidden focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] group">
                    <div className="pl-4 pr-3 flex items-center justify-center text-white/40 group-focus-within:text-violet-400 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="flex-1 h-full bg-transparent text-white placeholder-white/30 focus:outline-none pr-4 w-full"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/70" htmlFor="password">Password</label>
                    <a href="#" className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</a>
                  </div>
                  <div className="flex items-center h-14 w-full rounded-xl bg-white/5 border border-white/10 overflow-hidden focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] group">
                    <div className="pl-4 pr-3 flex items-center justify-center text-white/40 group-focus-within:text-violet-400 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="flex-1 h-full bg-transparent text-white placeholder-white/30 focus:outline-none w-full"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-4 pl-2 flex items-center justify-center text-white/40 hover:text-white transition-colors focus:outline-none h-full"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative flex items-center cursor-pointer group">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 rounded border border-white/20 bg-white/5 peer-checked:bg-violet-500 peer-checked:border-violet-500 transition-all flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-3 text-sm text-white/60 group-hover:text-white/80 transition-colors">Remember me for 30 days</span>
                  </label>
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
                  className="w-full h-14 mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-sm text-white/50 mt-8">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Create a free workspace
                </Link>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
