'use client';

import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
}

const AUTH_STORAGE_KEY = 'vita-auth-user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage first for instant UI
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    }
    
    // Then verify with server
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
        }
      } else {
        setUser(null);
        // Clear localStorage on auth failure
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch (error) {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
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
      // Clear localStorage on logout
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  };

  return { user, loading, logout, refresh: checkAuth };
}

