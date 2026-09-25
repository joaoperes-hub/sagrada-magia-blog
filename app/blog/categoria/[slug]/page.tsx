import { Metadata } from 'next';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';
import { categories, getCategoryBySlug } from '@/lib/categories';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return {
    title: `${category?.name || 'Categoria'} | Blog Sagrada Magia`,
    description: category?.description || 'Posts da categoria',
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const supabase = getSupabase();
    const category = getCategoryBySlug(slug);

    if (!category) {
      return (
        <div className="min-h-screen bg-sagrada-cream flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-quiche text-sagrada-magenta mb-4">Categoria não encontrada</h1>
            <Link href="/blog" className="text-sagrada-magenta hover:text-sagrada-magenta-dark font-amiko">
              ← Voltar ao blog
            </Link>
          </div>
        </div>
      );
    }

    // Buscar posts da categoria
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('category', category.slug)
      .order('created_at', { ascending: false });

    return (
      <div className="min-h-screen bg-sagrada-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/blog" className="text-sagrada-magenta hover:text-sagrada-magenta-dark font-amiko mb-6 inline-block">
            ← Voltar ao blog
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl font-quiche text-sagrada-magenta mb-2">
              {category.icon} {category.name}
            </h1>
            <p className="text-gray-600 font-niramit">
              {category.description}
            </p>
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="bg-white rounded-lg shadow-sagrada-md hover:shadow-sagrada-lg transition-shadow p-6 cursor-pointer h-full flex flex-col">
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h2 className="text-xl font-amiko text-sagrada-magenta mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 flex-grow font-niramit">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                      <span>⏱️ {post.reading_time} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 font-niramit">
                Nenhum post nesta categoria ainda. ✨
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar categoria:', error);
    return (
      <div className="min-h-screen bg-sagrada-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-quiche text-sagrada-magenta mb-4">Erro ao carregar categoria</h1>
          <p className="text-gray-600 font-niramit">Por favor, tente novamente.</p>
        </div>
      </div>
    );
  }
}
