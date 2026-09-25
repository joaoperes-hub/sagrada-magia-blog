import { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog Sagrada Magia | Espiritualidade e Bem-estar',
  description: 'Conteúdo exclusivo sobre meditação, cristais, tarô, rituais e espiritualidade.',
  openGraph: {
    title: 'Blog Sagrada Magia',
    description: 'Conteúdo exclusivo sobre meditação, cristais, tarô, rituais e espiritualidade.',
    type: 'website',
  },
};

export default async function BlogHome() {
  try {
    const supabase = getSupabaseAdmin();

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(12);

    return (
      <div className="min-h-screen bg-sagrada-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-quiche text-sagrada-magenta mb-4">
              ✨ Blog Sagrada Magia
            </h1>
            <p className="text-xl text-gray-600 font-niramit">
              Conteúdo exclusivo sobre espiritualidade e bem-estar
            </p>
          </div>

          {/* Posts Grid */}
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
              <p className="text-gray-600 text-lg font-niramit">
                Nenhum post publicado ainda. Volte em breve! ✨
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
    return (
      <div className="min-h-screen bg-sagrada-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-quiche text-sagrada-magenta mb-4">Oops! Erro ao carregar o blog</h1>
          <p className="text-gray-600 font-niramit">Por favor, tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }
}
