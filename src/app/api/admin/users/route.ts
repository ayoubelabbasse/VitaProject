import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  if (!prisma) {
    return NextResponse.json(
      { users: [], error: 'Database not available. Please configure DATABASE_URL and run migrations.' },
      { status: 503 },
    );
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { users: [], error: 'Failed to load users from database' },
      { status: 500 },
    );
  }
}


