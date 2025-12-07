'use client';

import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Skip network call entirely when there's no auth-token cookie
      if (typeof document !== 'undefined') {
        const hasToken = document.cookie
          .split(';')
          .some((cookie) => cookie.trim().startsWith('auth-token='));

        if (!hasToken) {
          setUser(null);
          setLoading(false);
          return;
        }
      }

      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUser(data.user ?? null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return { user, loading, logout, refresh: checkAuth };
}

