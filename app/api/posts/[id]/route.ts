import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

function validateToken(request: NextRequest): boolean {
  const token = request.headers.get('authorization')?.split('Bearer ')[1];
  if (!token) return false;
  const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
  return token === validPassword;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id]
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar post';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/posts/[id]
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    if (!validateToken(request)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    let readTime = body.reading_time;
    if (body.content) {
      const wordCount = body.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
      readTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...body,
        reading_time: readTime,
        updated_at: new Date().toISOString(),
        published_at: body.published ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar post';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/posts/[id]
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    if (!validateToken(request)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await context.params;
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao deletar post';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
