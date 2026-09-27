import { NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/data';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, price, originalPrice, category, description, images, inStock, variants, featured } = body;

    if (!title || price === undefined || !category) {
      return NextResponse.json({ error: 'Title, price, and category are required' }, { status: 400 });
    }

    const newProduct = await addProduct({
      title,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      description: description || '',
      images: images || ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'],
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      variants: variants || [],
      featured: Boolean(featured)
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
