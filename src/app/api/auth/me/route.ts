import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/middleware';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/lib/users';

// Mark this route as dynamic because it reads request cookies
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);

    // No token -> not logged in
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ user: null });
    }

    const user = getUserById(decoded.id);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ user: null });
  }
}
