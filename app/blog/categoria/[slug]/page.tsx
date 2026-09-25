import { Metadata } from 'next';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';
import { categories, getCategoryBySlug } from '@/lib/categories';

export const dynamic = 'force-dynamic';

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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-16 h-16 bg-sagrada-magenta/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔮</span>
            </div>
            <h1 className="text-2xl font-amiko font-bold text-sagrada-magenta mb-3">Categoria não encontrada</h1>
            <p className="text-sagrada-gray-dark font-niramit mb-6">Esta categoria não existe ou foi removida.</p>
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-sagrada-magenta text-white font-amiko font-semibold rounded-full hover:bg-sagrada-magenta-dark transition-colors"
            >
              Voltar ao Blog
            </Link>
          </div>
        </div>
      );
    }

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('category', category.slug)
      .order('created_at', { ascending: false });

    return (
      <div className="min-h-screen">
        {/* Category Hero */}
        <section className="relative bg-gradient-to-br from-sagrada-cream via-sagrada-pink-light/20 to-sagrada-mint-light/30 overflow-hidden">
          <div className="absolute top-10 right-20 w-48 h-48 bg-sagrada-magenta/5 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm font-niramit text-sagrada-gray-dark mb-8">
              <Link href="/blog" className="hover:text-sagrada-magenta transition-colors">Blog</Link>
              <span className="text-sagrada-magenta/30">/</span>
              <span className="text-sagrada-magenta font-semibold">{category.name}</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/80 backdrop-blur rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-sagrada-magenta/5">
                {category.icon}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-amiko font-bold text-sagrada-black">
                  {category.name}
                </h1>
                <p className="text-sagrada-gray-dark font-niramit mt-1">
                  {category.description}
                </p>
              </div>
            </div>

            {/* Other Category Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-8">
              <Link
                href="/blog"
                className="px-4 py-2 bg-white/60 text-sagrada-gray-dark hover:bg-sagrada-magenta hover:text-white text-sm font-amiko font-semibold rounded-full transition-all duration-200 border border-sagrada-magenta/10 hover:border-sagrada-magenta"
              >
                Todos
              </Link>
              {categories.filter(c => c.slug !== category.slug).slice(0, 6).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog/categoria/${cat.slug}`}
                  className="px-4 py-2 bg-white/60 text-sagrada-gray-dark hover:bg-sagrada-magenta hover:text-white text-sm font-amiko font-semibold rounded-full transition-all duration-200 border border-sagrada-magenta/10 hover:border-sagrada-magenta"
                >
                  {cat.icon} {cat.name.split(' ')[0]}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Posts */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-white rounded-2xl overflow-hidden card-hover border border-sagrada-magenta/5 h-full flex flex-col">
                    {post.featured_image ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-sagrada-magenta/8 via-sagrada-pink-light/15 to-sagrada-mint-light/15 flex items-center justify-center">
                        <span className="text-5xl opacity-30">{category.icon}</span>
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-amiko font-bold text-sagrada-black group-hover:text-sagrada-magenta transition-colors mb-2 line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-sagrada-gray-dark text-sm font-niramit mb-4 flex-grow line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-sagrada-gray-medium font-niramit pt-4 border-t border-sagrada-magenta/5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-sagrada-magenta/10 rounded-full flex items-center justify-center text-sagrada-magenta text-[10px]">
                            {post.author_name?.charAt(0)?.toUpperCase() || '✨'}
                          </div>
                          <span>{post.author_name}</span>
                        </div>
                        <span>{post.reading_time} min</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-sagrada-magenta/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">{category.icon}</span>
              </div>
              <h2 className="text-2xl font-amiko font-bold text-sagrada-black mb-3">
                Nenhum artigo nesta categoria
              </h2>
              <p className="text-sagrada-gray-dark font-niramit text-lg max-w-md mx-auto mb-8">
                Em breve teremos conteúdos sobre {category.name.toLowerCase()}.
              </p>
              <Link
                href="/blog"
                className="inline-block px-6 py-3 bg-sagrada-magenta text-white font-amiko font-semibold rounded-full hover:bg-sagrada-magenta-dark transition-colors"
              >
                Explorar outros artigos
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar categoria:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-sagrada-magenta/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌙</span>
          </div>
          <h1 className="text-2xl font-amiko font-bold text-sagrada-magenta mb-3">Erro ao carregar categoria</h1>
          <p className="text-sagrada-gray-dark font-niramit mb-6">Por favor, tente novamente.</p>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-sagrada-magenta text-white font-amiko font-semibold rounded-full hover:bg-sagrada-magenta-dark transition-colors"
          >
            Voltar ao Blog
          </Link>
        </div>
      </div>
    );
  }
}
