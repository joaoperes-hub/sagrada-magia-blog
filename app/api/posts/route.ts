import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

function validateToken(request: NextRequest): boolean {
  const token = request.headers.get('authorization')?.split('Bearer ')[1];
  if (!token) return false;
  const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
  return token === validPassword;
}

// GET /api/posts - Listar posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedParam = searchParams.get('published');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') || '20';

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    // Se não especificado ou 'true', pegar apenas publicados; se 'false' pegar todos
    if (publishedParam !== 'false') {
      query = query.eq('published', true);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar posts';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/posts - Criar novo post
export async function POST(request: NextRequest) {
  try {
    if (!validateToken(request)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      category,
      author_name,
      seo_title,
      seo_description,
      seo_keywords,
      published,
    } = body;

    if (!title || !slug || !excerpt || !content || !author_name) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: title, slug, excerpt, content, author_name' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Calcular tempo de leitura (aprox 200 palavras/min)
    const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        title,
        slug,
        excerpt,
        content,
        featured_image: featured_image || null,
        category: category || null,
        author_name,
        seo_title: seo_title || title,
        seo_description: seo_description || excerpt,
        seo_keywords: seo_keywords || null,
        published: published || false,
        reading_time: readTime,
        published_at: published ? new Date().toISOString() : null,
      }])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar post';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
