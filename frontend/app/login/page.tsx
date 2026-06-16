'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, Zap, ArrowRight, Shield, Building, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  
  // Validation & Error State
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        emailInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Validation Logic
  const isEmailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailError = emailTouched && !isEmailValid && email.length > 0;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isEmailValid || !password) {
      setError('Please provide a valid email and password.');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(message);
      setLoading(false);
      triggerShake();
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <>
      <title>Nexus | Dashboard Login</title>
      <meta name="description" content="Sign in to your Nexus Dashboard workspace." />
      <link rel="canonical" href="https://nexus.example.com/login" />
      
      <style dangerouslySetInnerHTML={{__html: `
        :root { color-scheme: dark; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-fade-up {
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        /* Dashboard mock bars animation */
        @keyframes growUp {
          from { height: 0; opacity: 0; }
          to { opacity: 1; }
        }
        .mock-bar {
          animation: growUp 1s ease-out forwards;
          transform-origin: bottom;
        }
      `}} />

      <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[#050816] text-white font-sans selection:bg-violet-500/30 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT PANEL - BRAND ZONE */}
        <div className="flex w-full lg:w-[55%] relative flex-col justify-between p-8 sm:p-12 lg:p-12 overflow-hidden border-t lg:border-t-0 lg:border-r border-white/5 order-2 lg:order-1">
          {/* Animated Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[130px] animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] rounded-full bg-fuchsia-600/15 blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
          </div>
          
          {/* Grid lines pattern with radial mask */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,#000_10%,transparent_100%)] pointer-events-none" />
          
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

          {/* Top Logo */}
          <div className="hidden lg:flex relative z-10 items-center gap-3 animate-fade-up" style={{ animationDelay: '0ms' }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Nexus</span>
          </div>

          {/* Center Content */}
          <div className="relative z-10 max-w-xl mt-12 mb-auto">
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-6 animate-fade-up text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60" style={{ animationDelay: '150ms' }}>
              Manage Everything From One Dashboard.
            </h1>
            <p className="text-lg text-white/60 leading-relaxed animate-fade-up font-light" style={{ animationDelay: '300ms' }}>
              Streamline your workflow, track analytics in real-time, and scale your business with our premium toolset.
            </p>
          </div>

          {/* Bottom Mockup & Badges */}
          <div className="relative z-10 animate-fade-up" style={{ animationDelay: '450ms' }}>
            {/* Mockup Window */}
            <div className="aspect-[16/10] w-full max-w-[600px] rounded-t-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 overflow-hidden relative shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-20 rounded-xl bg-white/5 border border-white/5" />
                <div className="h-20 rounded-xl bg-white/5 border border-white/5" />
                <div className="h-20 rounded-xl bg-white/5 border border-white/5" />
              </div>
              <div className="h-32 rounded-xl bg-white/5 border border-white/5 flex items-end p-4 gap-3">
                {/* Fixed realistic bar chart heights */}
                {[60, 35, 80, 45, 70, 55, 90, 30].map((h, i) => (
                  <div key={i} className="flex-1 bg-violet-500/50 rounded-t-sm mock-bar" style={{ height: `${h}%`, animationDelay: `${500 + i * 50}ms` }} />
                ))}
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#050816] to-transparent pointer-events-none" />
            </div>
            
            {/* Footer Badges */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm text-white/40 font-medium">
                <Shield className="w-4 h-4" aria-hidden="true" />
                Secure Authentication
              </div>
              <div className="flex items-center gap-2 text-sm text-white/40 font-medium">
                <Building className="w-4 h-4" aria-hidden="true" />
                Enterprise Grade
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - LOGIN CARD */}
        <div className="w-full lg:w-[45%] flex justify-center items-start pt-12 sm:pt-16 lg:pt-20 px-6 sm:px-12 relative lg:overflow-y-auto pb-12 order-1 lg:order-2">
          {/* Mobile Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-violet-600/20 blur-[80px]" />
          </div>

          <div 
            className={`w-full max-w-[480px] bg-[#0D0F1A] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 animate-fade-up ${isShaking ? 'animate-shake' : ''}`} 
            style={{ animationDelay: '250ms' }}
          >
            {/* Mobile Logo Row */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Nexus</span>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Welcome back</h2>
              <p className="text-white/50 text-sm">Enter your credentials to access your workspace.</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div role="alert" aria-live="polite" className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-red-400 font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button type="button" className="flex items-center justify-center gap-2 h-14 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-medium text-sm text-white/80 hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </button>
              <button type="button" className="flex items-center justify-center gap-2 h-14 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-medium text-sm text-white/80 hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>

            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-white/30 text-xs font-semibold uppercase tracking-widest">or continue with email</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 ${showEmailError ? 'text-red-400' : 'text-white/30'}`} aria-hidden="true" />
                </div>
                <input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full h-14 bg-[#0A0C18] border rounded-xl pl-12 pr-12 text-white text-sm focus:outline-none focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all placeholder:text-white/30 ${showEmailError ? 'border-red-400/50 focus:border-red-400' : 'border-white/[0.12] focus:border-violet-500/50'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  aria-label="Email Address"
                  aria-invalid={showEmailError}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <span className="text-[10px] font-mono text-white/20 mr-2 border border-white/10 rounded px-1.5 py-0.5 hidden sm:block">⌘K</span>
                  {isEmailValid && emailTouched && (
                    <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  )}
                </div>
                {showEmailError && (
                  <p className="text-red-400 text-xs mt-1.5 absolute -bottom-6 left-1" role="alert" aria-live="polite">Please enter a valid email</p>
                )}
              </div>

              {/* Password Input */}
              <div className={`relative ${showEmailError ? 'mt-4' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-white/30" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-14 bg-[#0A0C18] border border-white/[0.12] rounded-xl pl-12 pr-12 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all placeholder:text-white/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors focus:outline-none focus:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                </button>
              </div>

              <div className="flex items-center justify-between mt-1">
                {/* Remember Me Checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={keepSignedIn}
                      onChange={() => setKeepSignedIn(!keepSignedIn)}
                    />
                    <div className="w-4 h-4 border border-white/20 rounded-[4px] bg-white/5 peer-checked:bg-violet-600 peer-checked:border-violet-600 peer-focus-visible:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-colors flex items-center justify-center">
                      <Check className={`w-3 h-3 text-white transition-transform ${keepSignedIn ? 'scale-100' : 'scale-0'}`} aria-hidden="true" />
                    </div>
                  </div>
                  <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    Remember me <span className="text-white/30 text-xs hidden sm:inline">(keeps you signed in for 30 days)</span>
                  </span>
                </label>
                
                {/* Forgot Password */}
                <Link href="#" className="text-sm font-medium text-white/80 hover:text-white transition-colors relative group">
                  Forgot password?
                  <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-white/50 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                </Link>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-14 mt-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] group disabled:pointer-events-none disabled:opacity-70`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            {/* SSO & Register */}
            <div className="mt-8 text-center space-y-4">
              <div>
                <Link href="#" className="text-xs font-medium text-white/40 hover:text-white/70 transition-colors">
                  Sign in with SSO
                </Link>
              </div>
              <div className="text-sm text-white/50">
                Don't have an account?{' '}
                <Link href="/register" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
                  Create a free workspace
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </>
  );
}
