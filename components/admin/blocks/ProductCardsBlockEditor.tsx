'use client';
import React, { useState } from 'react';
import { ProductCardsBlock, ProductCard } from '@/lib/block-types';

interface Props {
  block: ProductCardsBlock;
  onChange: (data: ProductCardsBlock['data']) => void;
}

export default function ProductCardsBlockEditor({ block, onChange }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const searchProducts = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const response = await fetch(`/api/shopify/products?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.products || []);
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setSearching(false);
    }
  };

  const addProduct = (product: any) => {
    const newProduct: ProductCard = {
      shopifyId: product.id,
      title: product.title,
      imageUrl: product.image || product.images?.[0]?.src || '',
      price: product.price || product.variants?.[0]?.price || '0.00',
      handle: product.handle,
    };
    if (!block.data.products.find(p => p.shopifyId === newProduct.shopifyId)) {
      onChange({
        ...block.data,
        products: [...block.data.products, newProduct],
      });
    }
  };

  const removeProduct = (shopifyId: string) => {
    onChange({
      ...block.data,
      products: block.data.products.filter(p => p.shopifyId !== shopifyId),
    });
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={block.data.heading || ''}
        onChange={(e) => onChange({ ...block.data, heading: e.target.value })}
        placeholder="Título da seção (opcional, ex: Produtos recomendados)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
      />

      {/* Buscar produtos */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchProducts())}
          placeholder="Buscar produtos na Shopify..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
        />
        <button
          type="button"
          onClick={searchProducts}
          disabled={searching}
          className="px-6 py-3 bg-sagrada-magenta text-white rounded-lg font-amiko hover:bg-sagrada-magenta-dark transition-colors disabled:opacity-50"
        >
          {searching ? '...' : '🔍 Buscar'}
        </button>
      </div>

      {/* Resultados da busca */}
      {searchResults.length > 0 && (
        <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
          {searchResults.map((product: any) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
              onClick={() => addProduct(product)}
            >
              {(product.image || product.images?.[0]?.src) && (
                <img
                  src={product.image || product.images[0].src}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-niramit text-sm truncate">{product.title}</p>
                <p className="text-xs text-gray-500">R$ {product.price || product.variants?.[0]?.price}</p>
              </div>
              <span className="text-sagrada-magenta text-xl">+</span>
            </div>
          ))}
        </div>
      )}

      {/* Produtos selecionados */}
      {block.data.products.length > 0 && (
        <div>
          <p className="text-sm font-amiko text-gray-600 mb-2">Produtos selecionados:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {block.data.products.map((product) => (
              <div key={product.shopifyId} className="relative bg-white border border-gray-200 rounded-lg p-3">
                <button
                  type="button"
                  onClick={() => removeProduct(product.shopifyId)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.title} className="w-full h-24 object-cover rounded mb-2" />
                )}
                <p className="text-xs font-niramit truncate">{product.title}</p>
                <p className="text-xs text-gray-500">R$ {product.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estilo do botão */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-niramit">Estilo do botão</label>
          <select
            value={block.data.buttonStyle}
            onChange={(e) => onChange({ ...block.data, buttonStyle: e.target.value as any })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit bg-white"
          >
            <option value="ver-no-site">Ver no site</option>
            <option value="saiba-mais">Saiba mais</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-niramit">Texto do botão</label>
          <input
            type="text"
            value={block.data.buttonText}
            onChange={(e) => onChange({ ...block.data, buttonText: e.target.value })}
            placeholder="Ver no site"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
          />
        </div>
      </div>
    </div>
  );
}
