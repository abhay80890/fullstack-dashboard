'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center w-full max-w-5xl px-6 pt-32 pb-20 mx-auto text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-indigo-900/30 border border-indigo-500/20 backdrop-blur-sm"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-sm font-medium text-indigo-300 tracking-wide">Zenus v1.0 is here</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-7xl lg:text-[80px] font-bold tracking-tight mb-8 leading-[1.1]"
        >
          <span className="text-white block mb-2">Next-Gen</span>
          <span className="bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] text-transparent bg-clip-text">
            Company Management
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-slate-400 mb-12 leading-relaxed"
        >
          The all-in-one platform for your workforce. Manage attendance, track
          projects, and handle leave approvals with an immersive glassmorphism
          experience.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-8 py-4 bg-[#5e6ad2] hover:bg-[#4f5abf] text-white rounded-full font-medium transition-all shadow-[0_0_20px_rgba(94,106,210,0.4)] hover:shadow-[0_0_30px_rgba(94,106,210,0.6)] active:scale-95"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link 
            href="/admin" 
            className="flex items-center justify-center px-8 py-4 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-full font-medium transition-all active:scale-95"
          >
            Admin Setup
          </Link>
        </motion.div>

      </main>

      {/* Bottom Mockup Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 50 }}
        className="w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 translate-y-12"
      >
        <div className="h-64 rounded-t-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md p-6" />
        <div className="h-72 rounded-t-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md p-6 -translate-y-4 shadow-[0_-20px_40px_rgba(0,0,0,0.2)]" />
        <div className="h-64 rounded-t-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md p-6" />
      </motion.div>

    </div>
  );
}
