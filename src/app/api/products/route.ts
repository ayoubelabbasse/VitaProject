import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    if (!prisma) {
      // Return empty array if database not available (for Vercel deployment)
      return NextResponse.json({ products: [] });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      // SQLite doesn't support case-insensitive mode
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Transform products to match Product type
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: product.image,
      images: [product.image],
      rating: product.rating,
      reviews: product.reviews,
      inStock: product.inStock,
      description: product.description,
      benefits: (() => {
        try {
          if (!product.benefits) return [];
          return typeof product.benefits === 'string' ? JSON.parse(product.benefits) : product.benefits;
        } catch {
          return [];
        }
      })(),
      ingredients: (() => {
        try {
          if (!product.ingredients) return [];
          return typeof product.ingredients === 'string' ? JSON.parse(product.ingredients) : product.ingredients;
        } catch {
          return [];
        }
      })(),
      stock: product.stock,
      color: product.color || undefined,
      colorFamily: product.colorFamily || undefined,
      weight: product.weight || undefined,
    }));

    return NextResponse.json({ products: transformedProducts });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

