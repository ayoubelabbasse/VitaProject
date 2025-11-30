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
      { error: 'Database not available' },
      { status: 503 }
    );
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        category: body.category,
        brand: body.brand,
        color: body.color,
        colorFamily: body.colorFamily,
        weight: body.weight ? parseFloat(body.weight) : null,
        price: parseFloat(body.price),
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        image: body.image,
        description: body.description || '',
        stock: parseInt(body.stock) || 0,
        inStock: body.inStock !== false,
        rating: body.rating ? parseFloat(body.rating) : 0,
        reviews: body.reviews ? parseInt(body.reviews) : 0,
        benefits: body.benefits ? JSON.stringify(body.benefits) : null,
        ingredients: body.ingredients ? JSON.stringify(body.ingredients) : null,
      },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}







