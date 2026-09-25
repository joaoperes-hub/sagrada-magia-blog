'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { categories } from '@/lib/categories';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/posts');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const slug = (formData.get('slug') as string) || title.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const postData = {
      title,
      slug,
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      category: formData.get('category'),
      author_name: formData.get('author_name'),
      featured_image: formData.get('featured_image') || null,
      seo_title: formData.get('seo_title') || title,
      seo_description: formData.get('seo_description') || formData.get('excerpt'),
      seo_keywords: formData.get('seo_keywords') || null,
      published: formData.get('published') === 'true',
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar post');
      }

      router.push('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/posts"
            className="text-sagrada-magenta hover:text-sagrada-magenta-dark font-amiko"
          >
            ← Voltar
          </Link>
          <h1 className="text-3xl font-amiko text-sagrada-magenta">
            ✨ Novo Post
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-amiko text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Título do post"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit text-lg"
              onChange={(e) => {
                const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                if (slugInput && !slugInput.dataset.manual) {
                  slugInput.value = generateSlug(e.target.value);
                }
              }}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-amiko text-gray-700 mb-2">
              Slug (URL)
            </label>
            <input
              type="text"
              name="slug"
              placeholder="gerado-automaticamente-do-titulo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
              onInput={(e) => {
                (e.target as HTMLInputElement).dataset.manual = 'true';
              }}
            />
            <p className="text-xs text-gray-500 mt-1 font-niramit">Deixe em branco para gerar automaticamente</p>
          </div>

          {/* Autor e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-amiko text-gray-700 mb-2">
                Autor *
              </label>
              <input
                type="text"
                name="author_name"
                required
                placeholder="Nome do autor"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
              />
            </div>

            <div>
              <label className="block text-sm font-amiko text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit bg-white"
              >
                <option value="">Selecionar categoria</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Imagem Destacada */}
          <div>
            <label className="block text-sm font-amiko text-gray-700 mb-2">
              URL da Imagem Destacada
            </label>
            <input
              type="url"
              name="featured_image"
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
            />
          </div>

          {/* Resumo */}
          <div>
            <label className="block text-sm font-amiko text-gray-700 mb-2">
              Resumo *
            </label>
            <textarea
              name="excerpt"
              required
              rows={3}
              placeholder="Resumo do post (aparece na listagem)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit resize-none"
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-amiko text-gray-700 mb-2">
              Conteúdo * (HTML suportado)
            </label>
            <textarea
              name="content"
              required
              rows={15}
              placeholder="<p>Escreva o conteúdo aqui...</p>"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit resize-y font-mono text-sm"
            />
          </div>

          {/* SEO */}
          <div className="border border-sagrada-magenta-light rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-amiko text-sagrada-magenta">SEO (Opcional)</h3>

            <div>
              <label className="block text-sm font-amiko text-gray-700 mb-2">
                Título SEO
              </label>
              <input
                type="text"
                name="seo_title"
                placeholder="Título para mecanismos de busca"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
              />
            </div>

            <div>
              <label className="block text-sm font-amiko text-gray-700 mb-2">
                Descrição SEO
              </label>
              <textarea
                name="seo_description"
                rows={2}
                placeholder="Descrição para mecanismos de busca"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-amiko text-gray-700 mb-2">
                Palavras-chave SEO
              </label>
              <input
                type="text"
                name="seo_keywords"
                placeholder="meditação, cristais, espiritualidade"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
              />
            </div>
          </div>

          {/* Publicar */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="hidden"
                name="published"
                value="false"
              />
              <input
                type="checkbox"
                name="published"
                value="true"
                className="w-5 h-5 rounded border-gray-300 text-sagrada-magenta focus:ring-sagrada-magenta"
              />
              <span className="font-amiko text-gray-700">Publicar imediatamente</span>
            </label>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-sagrada-magenta hover:bg-sagrada-magenta-dark text-white font-amiko font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Criando...' : 'Criar Post'}
            </button>
            <Link
              href="/admin/posts"
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-amiko font-semibold rounded-lg transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
