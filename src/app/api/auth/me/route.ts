import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { getUserById } from '@/lib/users';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  const user = getUserById(authResult.user.id);

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return NextResponse.json({ user: userWithoutPassword });
}
