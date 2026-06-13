'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const colors = {
    success: { bg: 'rgba(0,212,170,0.1)', border: 'rgba(0,212,170,0.3)', color: '#00d4aa', icon: '✓' },
    error:   { bg: 'rgba(255,77,109,0.1)', border: 'rgba(255,77,109,0.3)', color: '#ff4d6d', icon: '✕' },
    info:    { bg: 'rgba(77,166,255,0.1)', border: 'rgba(77,166,255,0.3)', color: '#4da6ff', icon: 'ℹ' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2" style={{ maxWidth: '360px' }}>
        {toasts.map((t) => {
          const c = colors[t.type];
          return (
            <div key={t.id} className="animate-fade-in flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl"
              style={{ background: c.bg, border: `1px solid ${c.border}`, backdropFilter: 'blur(10px)' }}>
              <span className="text-base font-bold" style={{ color: c.color }}>{c.icon}</span>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{t.message}</p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within Toaster');
  return ctx;
}
