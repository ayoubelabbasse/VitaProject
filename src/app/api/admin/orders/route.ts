import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ orders });
}







