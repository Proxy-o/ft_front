'use client';
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import useOAuthCallback from './hooks/useOAuthCallback';
import { type OAuthCallbackParams } from '@/lib/types';
import HomeSkel from "@/components/skeletons/homeSkel";

const OAuthCallbackPage: React.FC = () => {
  const searchParams = useSearchParams();
  const provider = useParams().provider as string ?? null;
  const code = searchParams.get('code') ?? null;
  const state = searchParams.get('state') ?? null;

  const { mutate: handleCallback } = useOAuthCallback();

  useEffect(() => {
    const params: OAuthCallbackParams = {
      'provider': provider,
      'code': code,
      'state': state,
    }
    handleCallback(params);
  }, [provider, code, state, handleCallback]);

  return (
    <HomeSkel />
  );
};

export default OAuthCallbackPage;