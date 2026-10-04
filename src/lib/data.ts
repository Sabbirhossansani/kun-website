import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  images: string[];
  inStock: boolean;
  variants: ProductVariant[];
  featured?: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryZone: 'inside_dhaka' | 'outside_dhaka';
  deliveryFee: number;
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  paymentMethod?: 'cod' | 'bkash' | 'nagad' | 'card';
  transactionId?: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

const dataDir = path.join(process.cwd(), 'data');
const productsFile = path.join(dataDir, 'products.json');
const ordersFile = path.join(dataDir, 'orders.json');
const authFile = path.join(dataDir, 'auth.json');

function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const initialProducts: Product[] = [
    {
      id: "kun-j01",
      title: "KUN Anti-Tarnish Golden Butterfly Pendant Necklace",
      slug: "kun-anti-tarnish-golden-butterfly-pendant-necklace",
      price: 890,
      originalPrice: 1200,
      category: "Necklaces",
      description: "✨ Shine that never fades! Premium 18K Gold Plated Stainless Steel Butterfly Pendant. 100% Anti-tarnish, waterproof & hypoallergenic for everyday elegance.",
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
      ],
      inStock: true,
      variants: [{ name: "Color", options: ["18K Gold", "Silver"] }],
      featured: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "kun-j02",
      title: "KUN Waterproof Minimalist Snake Chain Bracelet",
      slug: "kun-waterproof-minimalist-snake-chain-bracelet",
      price: 750,
      originalPrice: 990,
      category: "Bracelets",
      description: "💍 Crafted for everyday elegance! Waterproof & sweatproof minimalist herringbone chain bracelet. Perfect for stacking or wearing solo.",
      images: ["https://images.unsplash.com/photo-1611591475155-4282faa7c2e7?auto=format&fit=crop&w=800&q=80"],
      inStock: true,
      variants: [{ name: "Finish", options: ["Glossy Gold", "Platinum Silver"] }],
      featured: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "kun-j03",
      title: "KUN Anti-Tarnish Cubic Zirconia Solitaire Ring",
      slug: "kun-anti-tarnish-cubic-zirconia-solitaire-ring",
      price: 650,
      originalPrice: 850,
      category: "Rings",
      description: "✨ High-grade CZ crystal ring with anti-tarnish protective coating. Non-fading, rustproof, and comfortable for daily wear.",
      images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"],
      inStock: true,
      variants: [{ name: "Ring Size", options: ["Adjustable Size", "Size 6", "Size 7", "Size 8"] }],
      featured: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "kun-j04",
      title: "KUN Waterproof Pearl Drop Huggie Hoop Earrings",
      slug: "kun-waterproof-pearl-drop-huggie-hoop-earrings",
      price: 590,
      originalPrice: 790,
      category: "Earrings",
      description: "🌸 Elegant freshwater pearl drop earrings. Anti-tarnish & 100% waterproof for rain, shower & everyday wear.",
      images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80"],
      inStock: true,
      variants: [{ name: "Metal", options: ["18K Gold Plated", "Silver Plated"] }],
      featured: false,
      createdAt: new Date().toISOString()
    }
  ];

  if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, JSON.stringify(initialProducts, null, 2), 'utf-8');
  }

  if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, JSON.stringify([], null, 2), 'utf-8');
  }

  if (!fs.existsSync(authFile)) {
    fs.writeFileSync(authFile, JSON.stringify({ passcode: 'kun2026' }, null, 2), 'utf-8');
  }
}

export function getPasscode(): string {
  ensureDataFiles();
  try {
    const content = fs.readFileSync(authFile, 'utf-8');
    const data = JSON.parse(content);
    return data.passcode || 'kun2026';
  } catch {
    return 'kun2026';
  }
}

export function savePasscode(passcode: string): void {
  ensureDataFiles();
  fs.writeFileSync(authFile, JSON.stringify({ passcode }, null, 2), 'utf-8');
}

// Products Helper Functions (Supports Supabase + File Fallback)
export async function getProducts(): Promise<Product[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
      if (!error && data && data.length > 0) return data as Product[];
    } catch (e) {
      console.error('Supabase fetch error:', e);
    }
  }

  ensureDataFiles();
  try {
    const content = fs.readFileSync(productsFile, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id || p.slug === id) || null;
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (supabase) {
    try {
      await supabase.from('products').upsert(products);
    } catch (e) {
      console.error('Supabase save error:', e);
    }
  }
  ensureDataFiles();
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf-8');
}

export async function addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'slug'>): Promise<Product> {
  const products = await getProducts();
  const id = `kun-${Date.now().toString(36)}`;
  const slug = productData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newProduct: Product = {
    ...productData,
    id,
    slug: `${slug}-${id}`,
    createdAt: new Date().toISOString()
  };

  if (supabase) {
    try {
      await supabase.from('products').insert([newProduct]);
    } catch (e) {
      console.error('Supabase insert product error:', e);
    }
  }

  products.unshift(newProduct);
  ensureDataFiles();
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf-8');
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updated = { ...products[index], ...updates };

  if (supabase) {
    try {
      await supabase.from('products').update(updates).eq('id', id);
    } catch (e) {
      console.error('Supabase update product error:', e);
    }
  }

  products[index] = updated;
  ensureDataFiles();
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf-8');
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  let products = await getProducts();
  const initialLen = products.length;
  products = products.filter(p => p.id !== id);
  if (products.length === initialLen) return false;

  if (supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase delete product error:', e);
    }
  }

  ensureDataFiles();
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf-8');
  return true;
}

// Orders Management (Supports Supabase + File Fallback)
export async function getOrders(): Promise<Order[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
      if (!error && data) return data as Order[];
    } catch (e) {
      console.error('Supabase fetch orders error:', e);
    }
  }

  ensureDataFiles();
  try {
    const content = fs.readFileSync(ordersFile, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<Order> {
  const orders = await getOrders();
  const id = `ord-${Date.now().toString(36)}`;
  const orderNumber = `KUN-${Math.floor(100000 + Math.random() * 900000)}`;

  const newOrder: Order = {
    ...orderData,
    id,
    orderNumber,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  if (supabase) {
    try {
      await supabase.from('orders').insert([newOrder]);
    } catch (e) {
      console.error('Supabase insert order error:', e);
    }
  }

  orders.unshift(newOrder);
  ensureDataFiles();
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf-8');
  return newOrder;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  const orders = await getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;

  orders[index].status = status;

  if (supabase) {
    try {
      await supabase.from('orders').update({ status }).eq('id', id);
    } catch (e) {
      console.error('Supabase update order status error:', e);
    }
  }

  ensureDataFiles();
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf-8');
  return orders[index];
}

export async function deleteOrder(id: string): Promise<boolean> {
  let orders = await getOrders();
  const initialLen = orders.length;
  orders = orders.filter(o => o.id !== id);
  if (orders.length === initialLen) return false;

  if (supabase) {
    try {
      await supabase.from('orders').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase delete order error:', e);
    }
  }

  ensureDataFiles();
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf-8');
  return true;
}
