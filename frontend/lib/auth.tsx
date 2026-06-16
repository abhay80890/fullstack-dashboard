'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from './api';

export interface User {
  id: string;
  name: string;
  nickname?: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, nickname: string, email: string, password: string) => Promise<void>;
  oauthLogin: (provider: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (u: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/users/me')
        .then(({ data }) => setUser(data.data))
        .catch(() => { localStorage.clear(); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
  };

  const register = async (name: string, nickname: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, nickname, email, password });
    const { user, accessToken, refreshToken } = data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
  };

  const oauthLogin = async (provider: string, code: string) => {
    const { data } = await api.post(`/auth/${provider}/callback`, { code });
    const { user, accessToken, refreshToken } = data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } catch {}
    localStorage.clear();
    setUser(null);
  };

  const updateUser = (u: Partial<User>) => setUser((prev) => (prev ? { ...prev, ...u } : prev));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, oauthLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
