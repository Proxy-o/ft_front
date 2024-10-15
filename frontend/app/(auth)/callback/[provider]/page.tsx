'use client';

import { useParams, useSearchParams } from 'next/navigation';
import useOAuthCallback from './hooks/useOAuthCallback';
import { type OAuthCallbackParams } from '@/lib/types';
import HomeSkel from "@/components/skeletons/homeSkel";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OAuthCallbackPage: React.FC = () => {
  const router = useRouter();
  const { mutate: handleCallback, isError, isPending } = useOAuthCallback();
  const searchParams = useSearchParams();
  const { provider } : { provider: string} = useParams();
  const code = searchParams.get('code')  || null;
  const state = searchParams.get('state') || null;

  useEffect(() => {

    const id = setTimeout(() => {
      router.push('/login')
    }, 20 * 1000);

    return () => clearTimeout(id);
  }, [router])

  useEffect(() => {
    if (!isError && !isPending) {
      handleCallback({provider, code, state} as OAuthCallbackParams)
    }
  }, [handleCallback, provider, code, state, isPending, isError])
  

  return (
    <HomeSkel />
  );
};

export default OAuthCallbackPage;