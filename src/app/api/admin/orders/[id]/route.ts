import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await requireAdmin(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body = await request.json();
      const order = await prisma.order.update({
        where: { id },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
      },
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

