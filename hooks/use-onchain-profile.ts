import { useCallback, useEffect, useState } from 'react';

import { fetchOnchainProfile, type OnchainProfile } from '@/lib/api/onchain';

export type OnchainState = {
  profile?: OnchainProfile;
  isLoading: boolean;
  error?: Error;
  refetch: () => Promise<void>;
};

export function useOnchainProfile(address: string): OnchainState {
  const [profile, setProfile] = useState<OnchainProfile | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const data = await fetchOnchainProfile(address);
      setProfile(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: loadProfile,
  };
}
