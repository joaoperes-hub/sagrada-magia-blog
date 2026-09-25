import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-sagrada-cream flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-amiko text-sagrada-magenta mb-6">
          ✨ Sagrada Magia
        </h1>
        <p className="text-xl text-sagrada-gray-dark font-niramit mb-8">
          Espiritualidade, bem-estar e autoconhecimento
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="px-8 py-4 bg-sagrada-magenta hover:bg-sagrada-magenta-dark text-white font-amiko font-semibold rounded-lg transition-colors shadow-lg"
          >
            Ver o Blog
          </Link>
          <Link
            href="/admin/posts"
            className="px-8 py-4 border-2 border-sagrada-magenta text-sagrada-magenta hover:bg-sagrada-magenta hover:text-white font-amiko font-semibold rounded-lg transition-colors"
          >
            Área Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
