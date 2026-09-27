import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';

    // 1. Try uploading to Supabase Storage bucket 'product-images' if configured
    if (supabase) {
      try {
        const ext = path.extname(file.name) || '.jpg';
        const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
        
        const { data, error } = await supabase.storage.from('product-images').upload(filename, buffer, {
          contentType: mimeType,
          upsert: true
        });

        if (!error && data) {
          const { data: publicData } = supabase.storage.from('product-images').getPublicUrl(filename);
          if (publicData?.publicUrl) {
            return NextResponse.json({ url: publicData.publicUrl });
          }
        }
      } catch (err) {
        console.error('Supabase storage upload error:', err);
      }
    }

    // 2. Fallback to Data URL (Base64) - Works 100% reliably in Next.js production on any server
    const base64String = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
