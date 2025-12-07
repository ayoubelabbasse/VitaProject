import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { normalizeProductImagePath, PRODUCT_IMAGE_FALLBACK } from '@/constants/paths';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  if (!prisma) {
    console.error('Admin products GET: prisma client not available');
    return NextResponse.json(
      { products: [], error: 'Database not available. Please configure DATABASE_URL and run migrations.' },
      { status: 503 }
    );
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const transformed = products.map((product) => {
      // Parse stored gallery JSON from DB
      let rawGallery: string[] = [];
      try {
        const stored = (product as any).galleryImages as string | null | undefined;
        rawGallery = stored ? ((JSON.parse(stored) as string[] | null) ?? []) : [];
      } catch {
        rawGallery = [];
      }

      // Normalize primary + gallery paths without applying curated mappings.
      // Admin should always see exactly what is stored, not auto-overridden media.
      const primary =
        normalizeProductImagePath(product.image) || PRODUCT_IMAGE_FALLBACK;

      const normalizedGallery = rawGallery
        .map((entry) => normalizeProductImagePath(entry) || entry)
        .filter(
          (entry): entry is string =>
            typeof entry === 'string' && Boolean(entry) && entry !== primary,
        );

      return {
        ...product,
        image: primary,
        images: [primary, ...normalizedGallery],
        galleryImages: normalizedGallery,
      };
    });

    return NextResponse.json({ products: transformed });
  } catch (error: any) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { products: [], error: 'Failed to load products from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available. Please configure DATABASE_URL and run migrations.' },
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
            .filter(
              (entry: unknown): entry is string =>
                typeof entry === 'string' && Boolean(entry)
            )
        : [];

    const createData: any = {
      name: body.name,
      category: body.category,
      brand: body.brand,
      color: body.color,
      colorFamily: body.colorFamily,
      weight: body.weight ? parseFloat(body.weight) : null,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      image: normalizedPrimary,
      galleryImages:
        galleryImages.length > 0 ? JSON.stringify(galleryImages) : null,
      description: body.description || '',
      stock: parseInt(body.stock) || 0,
      inStock: body.inStock !== false,
      rating: body.rating ? parseFloat(body.rating) : 0,
      reviews: body.reviews ? parseInt(body.reviews) : 0,
      benefits: body.benefits ? JSON.stringify(body.benefits) : null,
      ingredients: body.ingredients ? JSON.stringify(body.ingredients) : null,
    };

    const product = await prisma.product.create({
      data: createData,
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
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}







