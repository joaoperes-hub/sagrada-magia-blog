'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { categories } from '@/lib/categories';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author_name: string;
  featured_image: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  published: boolean;
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/posts');
      return;
    }

    const loadPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Post não encontrado');
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/posts');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const postData = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      category: formData.get('category'),
      author_name: formData.get('author_name'),
      featured_image: formData.get('featured_image') || null,
      seo_title: formData.get('seo_title'),
      seo_description: formData.get('seo_description'),
      seo_keywords: formData.get('seo_keywords') || null,
      published: formData.get('published') === 'true',
    };

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar post');
      }

      router.push('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600 font-niramit">Carregando post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-niramit mb-4">Post não encontrado</p>
          <Link href="/admin/posts" className="text-sagrada-magenta font-amiko">← Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/posts" className="text-sagrada-magenta hover:text-sagrada-magenta-dark font-amiko">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-amiko text-sagrada-magenta">
            ✏️ Editar Post
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
            <label className="block text-sm font-amiko text-gray-700 mb-2">Título *</label>
            <input
              type="text"
              name="title"
              required
              defaultValue={post.title}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit text-lg"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-amiko text-gray-700 mb-2">Slug (URL)</label>
            <input
              type="text"
              name="slug"
              required
              defaultValue={post.slug}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
            />
          </div>

          {/* Autor e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-amiko text-gray-700 mb-2">Autor *</label>
              <input
                type="text"
                name="author_name"
                required
                defaultValue={post.author_name}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
              />
            </div>

            <div>
              <label className="block text-sm font-amiko text-gray-700 mb-2">Categoria *</label>
              <select
                name="category"
                required
                defaultValue={post.category}
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

          {/* Imagem */}
          <div>
            <label className="block text-sm font-amiko text-gray-700 mb-2">URL da Imagem Destacada</label>
            <input
              type="url"
              name="featured_image"
              defaultValue={post.featured_image}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
            />
          </div>

          {/* Resumo */}
          <div>
            <label className="block text-sm font-amiko text-gray-700 mb-2">Resumo *</label>
            <textarea
              name="excerpt"
              required
              rows={3}
              defaultValue={post.excerpt}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit resize-none"
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-amiko text-gray-700 mb-2">Conteúdo * (HTML suportado)</label>
            <textarea
              name="content"
              required
              rows={15}
              defaultValue={post.content}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit resize-y font-mono text-sm"
            />
          </div>

          {/* SEO */}
          <div className="border border-sagrada-magenta-light rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-amiko text-sagrada-magenta">SEO (Opcional)</h3>

            <div>
              <label className="block text-sm font-amiko text-gray-700 mb-2">Título SEO</label>
              <input
                type="text"
                name="seo_title"
                defaultValue={post.seo_title}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
              />
            </div>

            <div>
              <label className="block text-sm font-amiko text-gray-700 mb-2">Descrição SEO</label>
              <textarea
                name="seo_description"
                rows={2}
                defaultValue={post.seo_description}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-amiko text-gray-700 mb-2">Palavras-chave SEO</label>
              <input
                type="text"
                name="seo_keywords"
                defaultValue={post.seo_keywords}
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
                defaultChecked={post.published}
                className="w-5 h-5 rounded border-gray-300 text-sagrada-magenta"
              />
              <span className="font-amiko text-gray-700">Publicado</span>
            </label>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-sagrada-magenta hover:bg-sagrada-magenta-dark text-white font-amiko font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-lg"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
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
