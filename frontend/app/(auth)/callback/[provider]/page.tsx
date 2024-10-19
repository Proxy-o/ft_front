'use client';

import { useParams, useSearchParams } from 'next/navigation';
import useOAuthCallback from './hooks/useOAuthCallback';
import { type OAuthCallbackParams } from '@/lib/types';
import HomeSkel from "@/components/skeletons/homeSkel";
import { useEffect } from 'react';

const OAuthCallbackPage: React.FC = () => {
  const { mutate: handleCallback } = useOAuthCallback();
  const searchParams = useSearchParams();
  const { provider } : { provider: string} = useParams();
  const code = searchParams.get('code')  || null;
  const state = searchParams.get('state') || null;

  useEffect(() => {
    if (code && state && provider) {
      handleCallback({provider, code, state} as OAuthCallbackParams);
    }
  }, [handleCallback, provider, code, state]);
  

  return (
    <HomeSkel />
  );
};

export default OAuthCallbackPage;