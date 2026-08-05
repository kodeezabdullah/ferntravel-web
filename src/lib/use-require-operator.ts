'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

export function useRequireOperator() {
  const { session, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    if (user && user.role !== 'operator') {
      router.replace('/operator');
    }
  }, [loading, session, user, router]);

  return { session, user, loading };
}
