'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './auth-context';
import { apiFetch } from './api';
import type { OperatorProfile } from '@/types/api';

type OperatorStatusState =
  | { kind: 'loading' }
  | { kind: 'unregistered' }
  | { kind: 'registered'; profile: OperatorProfile };

export function useOperatorStatus() {
  const { session, loading: authLoading } = useAuth();
  const [state, setState] = useState<OperatorStatusState>({ kind: 'loading' });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (authLoading || !session) return;
    let cancelled = false;
    apiFetch<OperatorProfile>('/operator/status')
      .then((profile) => {
        if (!cancelled) setState({ kind: 'registered', profile });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: 'unregistered' });
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, session, version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  if (!authLoading && !session) {
    return { kind: 'unregistered' as const, refresh, authLoading };
  }

  return { ...state, refresh, authLoading };
}
