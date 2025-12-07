import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { normalizeProductImagePath, resolveProductMedia } from '@/constants/paths';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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
    const normalizedPrimary =
      normalizeProductImagePath(body.image || (body.images?.[0])) || body.image;

    const galleryImages: string[] =
      Array.isArray(body.images) && body.images.length > 0
        ? body.images
            .map((entry: unknown) =>
              typeof entry === 'string' ? normalizeProductImagePath(entry) || entry : null
            )
            .filter((entry): entry is string => Boolean(entry))
        : [];

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category,
        brand: body.brand,
        color: body.color,
        colorFamily: body.colorFamily,
        weight: body.weight ? parseFloat(body.weight) : null,
        price: parseFloat(body.price),
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        image: normalizedPrimary,
        galleryImages: galleryImages.length > 0 ? JSON.stringify(galleryImages) : null,
        description: body.description || '',
        stock: parseInt(body.stock) || 0,
        inStock: body.inStock !== false,
        rating: body.rating ? parseFloat(body.rating) : 0,
        reviews: body.reviews ? parseInt(body.reviews) : 0,
        benefits: body.benefits ? JSON.stringify(body.benefits) : null,
        ingredients: body.ingredients ? JSON.stringify(body.ingredients) : null,
      },
    });

    const media = resolveProductMedia({
      name: product.name,
      fallbackImage: product.image,
      fallbackImages: galleryImages,
    });

    return NextResponse.json({
      product: {
        ...product,
        image: media.primary,
        images: media.gallery,
      },
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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

      await prisma.product.delete({
        where: { id },
      });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

