'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { categories } from '@/lib/categories';
import { ContentBlock } from '@/lib/block-types';
import BlockEditor from '@/components/admin/BlockEditor';
import ImageUploader from '@/components/admin/ImageUploader';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'seo'>('info');

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [published, setPublished] = useState(false);

  const generateSlug = (t: string) => {
    return t.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManual) setSlug(generateSlug(value));
  };

  // Convert blocks to HTML for storage
  const blocksToHtml = (blocks: ContentBlock[]): string => {
    return blocks.map(block => {
      switch (block.type) {
        case 'title': {
          const Tag = block.data.level;
          return `<${Tag}>${block.data.text}</${Tag}>`;
        }
        case 'image':
          return `<figure class="blog-image"><img src="${block.data.url}" alt="${block.data.alt}" />${block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : ''}</figure>`;
        case 'text':
          return block.data.content.startsWith('<') ? block.data.content : `<p>${block.data.content}</p>`;
        case 'banner-link':
          return `<div class="blog-banner" ${block.data.backgroundColor ? `style="background-color:${block.data.backgroundColor}"` : ''}><a href="${block.data.linkUrl}" target="_blank" rel="noopener noreferrer"><img src="${block.data.imageUrl}" alt="${block.data.title}" /><div class="banner-overlay"><h3>${block.data.title}</h3>${block.data.subtitle ? `<p>${block.data.subtitle}</p>` : ''}<span class="banner-btn">${block.data.linkText}</span></div></a></div>`;
        case 'product-cards':
          return `<div class="blog-products" data-button-style="${block.data.buttonStyle}" data-button-text="${block.data.buttonText}">${block.data.heading ? `<h3>${block.data.heading}</h3>` : ''}<div class="product-grid">${block.data.products.map(p => `<div class="product-card"><img src="${p.imageUrl}" alt="${p.title}" /><h4>${p.title}</h4><p class="price">R$ ${parseFloat(p.price).toFixed(2)}</p><a href="https://sagradamagia.com/products/${p.handle}" target="_blank" class="product-btn">${block.data.buttonText}</a></div>`).join('')}</div></div>`;
        case 'about-store':
          return `<div class="blog-about-store"><h3>${block.data.title}</h3><p>${block.data.description}</p>${block.data.imageUrls.length > 0 ? `<div class="social-proof">${block.data.imageUrls.map(url => `<img src="${url}" alt="Prova social" />`).join('')}</div>` : ''}<a href="${block.data.buttonUrl}" target="_blank" class="store-btn">${block.data.buttonText}</a></div>`;
        default:
          return '';
      }
    }).join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/posts'); return; }

    const content = blocksToHtml(blocks);
    const postData = {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      content,
      category,
      author_name: authorName,
      featured_image: featuredImage || null,
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
      seo_keywords: seoKeywords || null,
      published,
      blocks: JSON.stringify(blocks), // Store blocks JSON for editing
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/posts" className="text-sagrada-magenta hover:text-sagrada-magenta-dark font-amiko">
              ← Voltar
            </Link>
            <h1 className="text-3xl font-amiko text-sagrada-magenta">✨ Nova Matéria</h1>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-sagrada-magenta focus:ring-sagrada-magenta"
              />
              <span className="font-amiko text-sm text-gray-700">Publicar</span>
            </label>
            <button
              onClick={handleSubmit}
              disabled={loading || !title || !excerpt || !authorName}
              className="px-6 py-2.5 bg-sagrada-magenta hover:bg-sagrada-magenta-dark text-white font-amiko font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-lg"
            >
              {loading ? 'Salvando...' : 'Salvar Matéria'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 font-niramit">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-200">
          {[
            { key: 'info' as const, label: '📋 Informações' },
            { key: 'content' as const, label: '✏️ Conteúdo (Blocos)' },
            { key: 'seo' as const, label: '🔍 SEO' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 rounded-lg font-amiko text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-sagrada-magenta text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tab: Info */}
          {activeTab === 'info' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div>
                <label className="block text-sm font-amiko text-gray-700 mb-2">Título da Matéria *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Título do post"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit text-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-amiko text-gray-700 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                  placeholder="gerado-automaticamente"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-amiko text-gray-700 mb-2">Autor *</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Nome do autor"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-amiko text-gray-700 mb-2">Categoria *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit bg-white"
                  >
                    <option value="">Selecionar categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-amiko text-gray-700 mb-2">Imagem de Capa</label>
                <ImageUploader
                  value={featuredImage}
                  onChange={setFeaturedImage}
                  purpose="thumbnail"
                />
              </div>

              <div>
                <label className="block text-sm font-amiko text-gray-700 mb-2">Resumo *</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Resumo da matéria (aparece na listagem do blog)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit resize-none"
                />
              </div>
            </div>
          )}

          {/* Tab: Content (Blocks) */}
          {activeTab === 'content' && (
            <div>
              <BlockEditor blocks={blocks} onChange={setBlocks} />
            </div>
          )}

          {/* Tab: SEO */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div>
                <label className="block text-sm font-amiko text-gray-700 mb-2">Título SEO</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Título para mecanismos de busca"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
                />
              </div>
              <div>
                <label className="block text-sm font-amiko text-gray-700 mb-2">Descrição SEO</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={2}
                  placeholder="Descrição para mecanismos de busca"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-amiko text-gray-700 mb-2">Palavras-chave</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="meditação, cristais, espiritualidade"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
