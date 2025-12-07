import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeProductImagePath, resolveProductMedia } from '@/constants/paths';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Check if database is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform product to match Product type
    let benefits: string[] = [];
    let ingredients: string[] = [];
    
    try {
      if (product.benefits) {
        benefits = typeof product.benefits === 'string' ? JSON.parse(product.benefits) : product.benefits;
      }
    } catch (e) {
      console.warn('Error parsing benefits for product:', product.id);
    }
    
    try {
      if (product.ingredients) {
        ingredients = typeof product.ingredients === 'string' ? JSON.parse(product.ingredients) : product.ingredients;
      }
    } catch (e) {
      console.warn('Error parsing ingredients for product:', product.id);
    }

    // Gallery from DB JSON
    let gallery: string[] = [];
    try {
      const rawGallery = (product as any).galleryImages as
        | string
        | null
        | undefined;
      gallery = rawGallery
        ? ((JSON.parse(rawGallery) as string[] | null) ?? [])
        : [];
    } catch {
      gallery = [];
    }

    // Prefer DB-defined images; fall back to curated only if none
    const normalizedFromDb = [product.image, ...gallery]
      .map((entry) => normalizeProductImagePath(entry))
      .filter((entry): entry is string => Boolean(entry));

    let primary: string;
    let images: string[];

    if (normalizedFromDb.length > 0) {
      primary = normalizedFromDb[0];
      images = normalizedFromDb;
    } else {
      const media = resolveProductMedia({
        name: product.name,
      });
      primary = media.primary;
      images = media.gallery;
    }

    const transformedProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: primary,
      images,
      rating: product.rating,
      reviews: product.reviews,
      inStock: product.inStock,
      description: product.description,
      benefits,
      ingredients,
      stock: product.stock,
      color: product.color || undefined,
      colorFamily: product.colorFamily || undefined,
      weight: product.weight || undefined,
    };

    return NextResponse.json({ product: transformedProduct });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

