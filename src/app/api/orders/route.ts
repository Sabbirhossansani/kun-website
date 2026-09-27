import { NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/data';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, deliveryZone, items, notes } = body;

    if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required customer or item information' }, { status: 400 });
    }

    const deliveryFee = deliveryZone === 'outside_dhaka' ? 130 : 70;
    const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const totalAmount = subtotal + deliveryFee;

    const newOrder = await createOrder({
      customerName,
      phone,
      address,
      deliveryZone: deliveryZone || 'inside_dhaka',
      deliveryFee,
      items,
      subtotal,
      totalAmount,
      notes
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
