import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') || '20';

    if (!query || query.trim().length < 2) {
      return NextResponse.json([], { status: 200 });
    }

    const supabase = getSupabaseAdmin();

    let searchQuery = supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`);

    if (category) {
      searchQuery = searchQuery.eq('category', category);
    }

    const { data, error } = await searchQuery;

    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar posts';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
