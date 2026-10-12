import { Metadata } from 'next';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';
import { categories } from '@/lib/categories';
import HeroCarousel from '@/components/HeroCarousel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sagrada Magia | Espiritualidade e Bem-estar',
  description: 'Descubra o universo da espiritualidade, meditação, cristais, tarô e autoconhecimento.',
};

export default async function Home() {
  const supabase = getSupabase();
  
  // Fetch more posts for carousel + listing
  const { data: allPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image, category, created_at, reading_time, author_name')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(8);

  const posts = allPosts || [];
  
  // Add category info to posts for carousel
  const postsWithCategory = posts.map(post => ({
    ...post,
    category_name: categories.find(c => c.slug === post.category)?.name || post.category,
    category_icon: categories.find(c => c.slug === post.category)?.icon || '✨',
  }));
  
  const recentPosts = posts.slice(0, 3);
  const featuredCategories = categories.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel posts={postsWithCategory} />

      {/* Categories Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-amiko font-bold text-sagrada-black mb-3">
              Explore por Categoria
            </h2>
            <p className="text-sagrada-gray-dark font-niramit text-lg max-w-xl mx-auto">
              Escolha o tema que mais ressoa com você
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/categoria/${cat.slug}`}
                className="group relative bg-white rounded-2xl p-6 text-center card-hover border border-sagrada-magenta/5 hover:border-sagrada-magenta/20"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-amiko font-semibold text-sagrada-black text-sm sm:text-base mb-1">
                  {cat.name}
                </h3>
                <p className="text-sagrada-gray-medium text-xs sm:text-sm font-niramit line-clamp-2 hidden sm:block">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sagrada-magenta hover:text-sagrada-magenta-dark font-amiko font-semibold animated-underline transition-colors"
            >
              Ver todas as categorias
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <section className="py-16 sm:py-20 bg-white/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-amiko font-bold text-sagrada-black mb-3">
                  Publicações Recentes
                </h2>
                <p className="text-sagrada-gray-dark font-niramit text-lg">
                  Leituras para nutrir sua alma
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-sagrada-magenta hover:text-sagrada-magenta-dark font-amiko font-semibold animated-underline transition-colors"
              >
                Ver todos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {recentPosts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-white rounded-2xl overflow-hidden card-hover border border-sagrada-magenta/5 h-full flex flex-col">
                    {post.featured_image ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-sagrada-magenta/10 via-sagrada-pink-light/20 to-sagrada-mint-light/20 flex items-center justify-center">
                        <span className="text-5xl opacity-50">
                          {categories.find(c => c.slug === post.category)?.icon || '✨'}
                        </span>
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-grow">
                      {post.category && (
                        <span className="inline-block self-start px-3 py-1 bg-sagrada-magenta/10 text-sagrada-magenta-dark text-xs font-amiko font-semibold rounded-full mb-3">
                          {categories.find(c => c.slug === post.category)?.icon}{' '}
                          {categories.find(c => c.slug === post.category)?.name || post.category}
                        </span>
                      )}

                      <h3 className="text-lg font-amiko font-bold text-sagrada-black group-hover:text-sagrada-magenta transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-sagrada-gray-dark text-sm font-niramit mb-4 flex-grow line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-sagrada-gray-medium font-niramit pt-4 border-t border-sagrada-magenta/5">
                        <span>{new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>{post.reading_time} min de leitura</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sagrada-magenta hover:text-sagrada-magenta-dark font-amiko font-semibold transition-colors"
              >
                Ver todos os artigos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-sagrada-magenta/10 via-sagrada-pink-light/30 to-sagrada-mint-light/20 rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-sagrada-magenta/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sagrada-mint/10 rounded-full blur-2xl" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-amiko font-bold text-sagrada-black mb-4">
                Descubra Produtos Sagrados
              </h2>
              <p className="text-sagrada-gray-dark font-niramit text-lg max-w-lg mx-auto mb-8">
                Cristais, incensos, velas e tudo para sua prática espiritual na nossa loja online.
              </p>
              <a
                href="https://sagradamagia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-sagrada-magenta hover:bg-sagrada-magenta-dark text-white font-amiko font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Visitar a Loja
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sagrada-magenta/10 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-amiko font-bold text-sagrada-magenta text-lg">Sagrada Magia</span>
            </div>
            <p className="text-sagrada-gray-medium text-sm font-niramit">
              &copy; {new Date().getFullYear()} Sagrada Magia. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://sagradamagia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sagrada-gray-medium hover:text-sagrada-magenta text-sm font-niramit transition-colors"
              >
                Loja
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
