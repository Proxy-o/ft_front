'use client';
import { useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import useOAuthCallback from './hooks/useOAuthCallback';
import { type OAuthCallbackParams } from '@/lib/types';
import HomeSkel from "@/components/skeletons/homeSkel";

const OAuthCallbackPage: React.FC = () => {
  const { mutate: handleCallback, isPending, isError } = useOAuthCallback();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { provider } = useParams();

  const params: OAuthCallbackParams = {
    'provider': provider as string ?? null,
    'code': searchParams.get('code') ?? null,
    'state': searchParams.get('state') ?? null,
  };

  useEffect(() => {
    if (!isPending && !isError) {
      handleCallback(params);
    }
  }, [isPending, isError, params, handleCallback]);

  useEffect(() => {
    const id = setTimeout(() => router.push('/login'), 15 * 1000); // 15 secs
    return () => clearTimeout(id);
  }, [router]);

  return (
    <HomeSkel />
  );
};

export default OAuthCallbackPage;