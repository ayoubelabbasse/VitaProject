import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export function getAuthToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('auth-token')?.value;
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
  return cookieToken || headerToken || null;
}

export async function requireAuth(request: NextRequest): Promise<{ user: any; error: null } | { user: null; error: NextResponse }> {
  const token = getAuthToken(request);
  
  if (!token) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const user = verifyToken(token);
  
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }),
    };
  }

  return { user, error: null };
}

export async function requireAdmin(request: NextRequest): Promise<{ user: any; error: null } | { user: null; error: NextResponse }> {
  const authResult = await requireAuth(request);
  
  if (authResult.error) {
    return authResult;
  }

  if (authResult.user.role !== 'admin') {
    return {
      user: null,
      error: NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 }),
    };
  }

  return authResult;
}


