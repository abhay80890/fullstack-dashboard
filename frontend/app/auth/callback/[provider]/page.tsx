'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { oauthLogin } = useAuth();
  
  const [error, setError] = useState('');

  useEffect(() => {
    const provider = params.provider as string;
    const code = searchParams.get('code');

    if (!provider || !code) {
      setError('Invalid OAuth callback parameters.');
      return;
    }

    const authenticate = async () => {
      try {
        await oauthLogin(provider, code);
        router.push('/dashboard');
      } catch (err: unknown) {
        console.error(err);
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Authentication failed. Please try again.';
        setError(message);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    authenticate();
  }, [params, searchParams, oauthLogin, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050816] text-white">
      <div className="text-center flex flex-col items-center">
        {error ? (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <span className="text-red-500 text-xl font-bold">!</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
            <p className="text-white/60">{error}</p>
            <p className="text-white/40 text-sm mt-4">Redirecting you back to login...</p>
          </>
        ) : (
          <>
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-6" />
            <h2 className="text-xl font-semibold mb-2 tracking-tight">Authenticating...</h2>
            <p className="text-white/60 text-sm">Please wait while we securely sign you in.</p>
          </>
        )}
      </div>
    </div>
  );
}
