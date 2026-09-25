import { Metadata } from 'next';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';
import { categories, getCategoryBySlug } from '@/lib/categories';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog | Sagrada Magia',
  description: 'Conteúdo exclusivo sobre meditação, cristais, tarô, rituais e espiritualidade.',
  openGraph: {
    title: 'Blog Sagrada Magia',
    description: 'Conteúdo exclusivo sobre meditação, cristais, tarô, rituais e espiritualidade.',
    type: 'website',
  },
};

export default async function BlogHome() {
  try {
    const supabase = getSupabase();

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(20);

    const featuredPost = posts && posts.length > 0 ? posts[0] : null;
    const remainingPosts = posts && posts.length > 1 ? posts.slice(1) : [];

    return (
      <div className="min-h-screen">
        {/* Hero Header */}
        <section className="relative bg-gradient-to-br from-sagrada-cream via-sagrada-pink-light/20 to-sagrada-mint-light/30 overflow-hidden">
          <div className="absolute top-10 right-20 w-48 h-48 bg-sagrada-magenta/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-36 h-36 bg-sagrada-mint/8 rounded-full blur-2xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-amiko font-bold text-sagrada-black mb-4">
                Blog <span className="text-gradient">Sagrada Magia</span>
              </h1>
              <p className="text-lg text-sagrada-gray-dark font-niramit max-w-xl mx-auto">
                Artigos sobre espiritualidade, autoconhecimento e práticas ancestrais
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              <Link
                href="/blog"
                className="px-4 py-2 bg-sagrada-magenta text-white text-sm font-amiko font-semibold rounded-full transition-all duration-200 shadow-sm"
              >
                Todos
              </Link>
              {categories.slice(0, 7).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog/categoria/${cat.slug}`}
                  className="px-4 py-2 bg-white/80 backdrop-blur text-sagrada-gray-dark hover:bg-sagrada-magenta hover:text-white text-sm font-amiko font-semibold rounded-full transition-all duration-200 border border-sagrada-magenta/10 hover:border-sagrada-magenta"
                >
                  {cat.icon} {cat.name.split(' ')[0]}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {posts && posts.length > 0 ? (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`} className="group block mb-12">
                  <article className="bg-white rounded-3xl overflow-hidden card-hover border border-sagrada-magenta/5">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {featuredPost.featured_image ? (
                        <div className="relative h-64 lg:h-full min-h-[280px] overflow-hidden">
                          <img
                            src={featuredPost.featured_image}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-transparent" />
                          <span className="absolute top-4 left-4 px-3 py-1 bg-sagrada-magenta/90 backdrop-blur text-white text-xs font-amiko font-semibold rounded-full">
                            Destaque
                          </span>
                        </div>
                      ) : (
                        <div className="h-64 lg:h-full min-h-[280px] bg-gradient-to-br from-sagrada-magenta/10 via-sagrada-pink-light/30 to-sagrada-mint-light/20 flex items-center justify-center">
                          <span className="text-7xl opacity-40">
                            {getCategoryBySlug(featuredPost.category)?.icon || '✨'}
                          </span>
                        </div>
                      )}

                      <div className="p-8 lg:p-10 flex flex-col justify-center">
                        {featuredPost.category && (
                          <span className="inline-block self-start px-3 py-1 bg-sagrada-magenta/10 text-sagrada-magenta-dark text-xs font-amiko font-semibold rounded-full mb-4">
                            {getCategoryBySlug(featuredPost.category)?.icon}{' '}
                            {getCategoryBySlug(featuredPost.category)?.name || featuredPost.category}
                          </span>
                        )}

                        <h2 className="text-2xl sm:text-3xl font-amiko font-bold text-sagrada-black group-hover:text-sagrada-magenta transition-colors mb-3 leading-tight">
                          {featuredPost.title}
                        </h2>

                        <p className="text-sagrada-gray-dark font-niramit text-base mb-6 line-clamp-3 leading-relaxed">
                          {featuredPost.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-sagrada-gray-medium font-niramit">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-sagrada-magenta/15 rounded-full flex items-center justify-center text-sagrada-magenta text-xs">
                              {featuredPost.author_name?.charAt(0)?.toUpperCase() || '✨'}
                            </div>
                            <span>{featuredPost.author_name}</span>
                          </div>
                          <span className="text-sagrada-magenta/30">|</span>
                          <span>{new Date(featuredPost.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</span>
                          <span className="text-sagrada-magenta/30">|</span>
                          <span>{featuredPost.reading_time} min</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Post Grid */}
              {remainingPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {remainingPosts.map((post: any) => {
                    const postCat = getCategoryBySlug(post.category);
                    return (
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
                              <span className="text-5xl opacity-30">
                                {postCat?.icon || '✨'}
                              </span>
                            </div>
                          )}

                          <div className="p-6 flex flex-col flex-grow">
                            {postCat && (
                              <span className="inline-block self-start px-2.5 py-0.5 bg-sagrada-magenta/8 text-sagrada-magenta-dark text-xs font-amiko font-semibold rounded-full mb-3">
                                {postCat.icon} {postCat.name.split('&')[0].trim().split(' ')[0]}
                              </span>
                            )}

                            <h3 className="text-lg font-amiko font-bold text-sagrada-black group-hover:text-sagrada-magenta transition-colors mb-2 line-clamp-2 leading-snug">
                              {post.title}
                            </h3>

                            <p className="text-sagrada-gray-dark text-sm font-niramit mb-4 flex-grow line-clamp-3 leading-relaxed">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between text-xs text-sagrada-gray-medium font-niramit pt-4 border-t border-sagrada-magenta/5">
                              <span>{new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>
                              <span>{post.reading_time} min de leitura</span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-sagrada-magenta/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌙</span>
              </div>
              <h2 className="text-2xl font-amiko font-bold text-sagrada-black mb-3">
                Em breve, novos artigos
              </h2>
              <p className="text-sagrada-gray-dark font-niramit text-lg max-w-md mx-auto">
                Estamos preparando conteúdos especiais para você. Volte em breve!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-sagrada-magenta/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌙</span>
          </div>
          <h1 className="text-2xl font-amiko font-bold text-sagrada-magenta mb-3">Erro ao carregar o blog</h1>
          <p className="text-sagrada-gray-dark font-niramit mb-6">Por favor, tente novamente mais tarde.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-sagrada-magenta text-white font-amiko font-semibold rounded-full hover:bg-sagrada-magenta-dark transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }
}
