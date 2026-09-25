import { Metadata } from 'next';
import { getSupabase, getSupabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getSupabase();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) {
    return { title: 'Post não encontrado' };
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    keywords: post.seo_keywords,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      type: 'article',
      images: post.featured_image ? [{ url: post.featured_image }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const supabase = getSupabase();

    // Buscar post
    const { data: post } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (!post) {
      return (
        <div className="min-h-screen bg-sagrada-cream flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-quiche text-sagrada-magenta mb-4">Post não encontrado</h1>
            <p className="text-gray-600 font-niramit mb-6">Desculpe, este post não existe ou foi removido.</p>
            <Link href="/blog" className="text-sagrada-magenta hover:text-sagrada-magenta-dark font-amiko">
              ← Voltar ao blog
            </Link>
          </div>
        </div>
      );
    }

    // Incrementar visualizações (usa admin client, não quebra se falhar)
    try {
      const adminSupabase = getSupabaseAdmin();
      await adminSupabase
        .from('blog_posts')
        .update({ views: (post.views || 0) + 1 })
        .eq('id', post.id);
    } catch (e) {
      // Silently ignore - views increment is non-critical
    }

    return (
      <div className="min-h-screen bg-sagrada-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <Link href="/blog" className="text-sagrada-magenta hover:text-sagrada-magenta-dark font-amiko mb-6 inline-block">
            ← Voltar ao blog
          </Link>

          <article>
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-96 object-cover rounded-lg mb-8"
              />
            )}

            <h1 className="text-4xl font-quiche text-sagrada-magenta mb-4">
              {post.title}
            </h1>

            <div className="flex gap-4 text-sm text-gray-600 font-niramit mb-8 pb-8 border-b border-gray-200">
              <span>Por {post.author_name}</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
              <span>•</span>
              <span>⏱️ {post.reading_time} min de leitura</span>
              <span>•</span>
              <span>👁️ {post.views} visualizações</span>
            </div>

            {/* Content */}
            <div
              className="prose max-w-none font-niramit text-gray-800 leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/blog"
                className="inline-block px-6 py-3 bg-sagrada-magenta text-white font-amiko rounded-lg hover:bg-sagrada-magenta-dark transition-colors"
              >
                ← Voltar ao blog
              </Link>
            </div>
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar post:', error);
    return (
      <div className="min-h-screen bg-sagrada-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-quiche text-sagrada-magenta mb-4">Erro ao carregar post</h1>
          <p className="text-gray-600 font-niramit">Por favor, tente novamente.</p>
        </div>
      </div>
    );
  }
}
