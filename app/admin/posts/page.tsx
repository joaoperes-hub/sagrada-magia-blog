'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories } from '@/lib/categories';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  author_name: string;
  created_at: string;
  views: number;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');
  const [showLoginForm, setShowLoginForm] = useState(true);

  // Carregar posts (se autenticado)
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setShowLoginForm(false);
      loadPosts(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const loadPosts = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?published=false', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao carregar posts');

      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const validUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

    if (username === validUsername && password === validPassword) {
      localStorage.setItem('admin_token', password);
      setToken(password);
      setShowLoginForm(false);
      loadPosts(password);
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setShowLoginForm(true);
    setPosts([]);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Tem certeza que quer deletar este post?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao deletar post');

      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar post');
    }
  };

  if (showLoginForm) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-sagrada-magenta-light p-8 shadow-sagrada-md">
            <h1 className="text-3xl font-quiche text-sagrada-magenta mb-2 text-center">
              Admin do Blog
            </h1>
            <p className="text-center text-gray-600 mb-6 font-niramit">
              Acesse para gerenciar posts da Sagrada Magia
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-amiko text-gray-700 mb-2">
                  Usuário
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Seu usuário"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta focus:ring-1 focus:ring-sagrada-magenta-light font-niramit"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-amiko text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Sua senha"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta focus:ring-1 focus:ring-sagrada-magenta-light font-niramit"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-sagrada-magenta hover:bg-sagrada-magenta-dark text-white font-amiko font-semibold rounded-lg transition-colors shadow-sagrada-md"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-quiche text-sagrada-magenta mb-2">
              ✨ Gerenciar Posts
            </h1>
            <p className="text-gray-600 font-niramit">
              Crie, edite e publique conteúdo para o blog da Sagrada Magia
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/posts/new"
              className="px-6 py-3 bg-sagrada-magenta hover:bg-sagrada-magenta-dark text-white font-amiko font-semibold rounded-lg transition-colors shadow-sagrada-md"
            >
              + Novo Post
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-amiko font-semibold rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 font-niramit">Carregando posts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4 font-niramit">Nenhum post criado ainda</p>
            <Link
              href="/admin/posts/new"
              className="inline-block px-6 py-3 bg-sagrada-magenta text-white font-amiko font-semibold rounded-lg transition-colors"
            >
              Criar o Primeiro Post
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-sagrada-magenta hover:shadow-sagrada-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-amiko text-gray-900 mb-1">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500 font-niramit">
                      por {post.author_name} • {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-amiko font-semibold ${
                      post.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.published ? '✓ Publicado' : '✏️ Rascunho'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-niramit">
                  {post.excerpt}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-xs text-gray-500 font-niramit">
                    <span>👁️ {post.views} visualizações</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="px-4 py-2 bg-sagrada-magenta text-white text-sm font-amiko rounded-lg hover:bg-sagrada-magenta-dark transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 text-sm font-amiko rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
