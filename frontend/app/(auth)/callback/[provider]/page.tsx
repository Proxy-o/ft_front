'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import useOAuthCallback from './hooks/useOAuthCallback';
import { OAuthCallbackParams } from '@/lib/types';

const OAuthCallbackPage: React.FC = () => {
  const searchParams = useSearchParams();
  const provider = useParams().provider;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const { mutate: handleCallback } = useOAuthCallback();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      console.log('isClient',provider, code, state);
      if (provider && code && state) {
        console.log('provider, code, state');
        console.table({ provider, code, state });
        handleCallback({ provider, code, state } as OAuthCallbackParams);
      }
    }
  }, [provider, code, state, handleCallback, isClient]);

  return (
    <div>
      <p>Processing...</p>
    </div>
  );
};

export default OAuthCallbackPage;