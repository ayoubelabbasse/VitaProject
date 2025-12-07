import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeProductImagePath, resolveProductMedia } from '@/constants/paths';
import { productCatalog } from '@/data/products';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const getStaticFallback = () => {
      let products = productCatalog;

      if (category) {
        products = products.filter((p) => p.category === category);
      }

      if (search) {
        const q = search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q),
        );
      }

      return products;
    };

    // Check if database is available
    if (!prisma) {
      // Fallback to static catalog if database not available (e.g. Vercel preview)
      return NextResponse.json({ products: getStaticFallback() });
    }

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

    // If database has no products yet (e.g. production DB not seeded),
    // fall back to the static catalog so the storefront is never empty.
    if (!products || products.length === 0) {
      return NextResponse.json({ products: getStaticFallback() });
    }

    // Transform products to match Product type
    const transformedProducts = products.map((product) => {
      // 1) Read gallery from DB JSON
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

      // 2) Prefer DB-defined images (normalized), fall back to curated only if none
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

      return {
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
        benefits: (() => {
          try {
            if (!product.benefits) return [];
            return typeof product.benefits === 'string'
              ? JSON.parse(product.benefits)
              : product.benefits;
          } catch {
            return [];
          }
        })(),
        ingredients: (() => {
          try {
            if (!product.ingredients) return [];
            return typeof product.ingredients === 'string'
              ? JSON.parse(product.ingredients)
              : product.ingredients;
          } catch {
            return [];
          }
        })(),
        stock: product.stock,
        color: product.color || undefined,
        colorFamily: product.colorFamily || undefined,
        weight: product.weight || undefined,
      };
    });

    return NextResponse.json({ products: transformedProducts });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

