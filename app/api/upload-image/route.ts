import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { validateRequestAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Alvo de tamanhos por propósito
const SIZE_PRESETS: Record<string, { width: number; height: number | null; fit: 'cover' | 'inside' }> = {
  hero:      { width: 2400, height: 1000, fit: 'cover' },   // Carrossel/Hero da home
  thumbnail: { width: 1600, height: 1067, fit: 'cover' },   // Thumbnail/featured_image
  content:   { width: 1600, height: null, fit: 'inside' },  // Imagem dentro da matéria
  banner:    { width: 1600, height: 600, fit: 'cover' },    // Bloco banner-link
  about:     { width: 800,  height: 800,  fit: 'cover' },   // Prova social (quadrada)
};

export async function POST(request: NextRequest) {
  try {
    if (!validateRequestAdmin(request)) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const purpose = ((formData.get('purpose') as string) || 'content').toLowerCase();

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Arquivo precisa ser uma imagem' }, { status: 400 });
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imagem muito grande (máx 15MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const size = SIZE_PRESETS[purpose] || SIZE_PRESETS.content;

    // Processa com sharp: redimensiona + converte pra WebP
    let img = sharp(buffer).rotate(); // auto-rotate baseado em EXIF
    if (size.height) {
      img = img.resize(size.width, size.height, { fit: size.fit, withoutEnlargement: true });
    } else {
      img = img.resize(size.width, null, { fit: 'inside', withoutEnlargement: true });
    }
    const processed = await img.webp({ quality: 85 }).toBuffer();

    // Supabase: usa service role se disponível, senão anon
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, serviceKey || anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const filename = `${purpose}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.webp`;
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filename, processed, {
        contentType: 'image/webp',
        upsert: false,
        cacheControl: '31536000',
      });

    if (uploadError) {
      return NextResponse.json({ error: `Upload falhou: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(filename);
    return NextResponse.json({
      url: urlData.publicUrl,
      filename,
      size: processed.length,
      dimensions: `${size.width}x${size.height || 'auto'}`,
    });
  } catch (e: any) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: e.message || 'Erro no upload' }, { status: 500 });
  }
}
