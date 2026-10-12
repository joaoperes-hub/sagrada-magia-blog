'use client';
import React from 'react';
import { BannerLinkBlock } from '@/lib/block-types';
import { categories } from '@/lib/categories';
import ImageUploader from '../ImageUploader';

interface Props {
  block: BannerLinkBlock;
  onChange: (data: BannerLinkBlock['data']) => void;
}

export default function BannerLinkBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-3">
      <ImageUploader
        value={block.data.imageUrl}
        onChange={(imageUrl) => onChange({ ...block.data, imageUrl })}
        purpose="banner"
        preview="banner"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={block.data.title}
          onChange={(e) => onChange({ ...block.data, title: e.target.value })}
          placeholder="Título do banner"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
        />
        <input
          type="text"
          value={block.data.subtitle || ''}
          onChange={(e) => onChange({ ...block.data, subtitle: e.target.value })}
          placeholder="Subtítulo (opcional)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-niramit">Link para</label>
          <select
            value={block.data.linkUrl}
            onChange={(e) => onChange({ ...block.data, linkUrl: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit bg-white"
          >
            <option value="">URL personalizada</option>
            <option value="https://sagradamagia.com">Loja Principal</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={`https://sagradamagia.com/collections/${cat.slug}`}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={block.data.linkUrl}
          onChange={(e) => onChange({ ...block.data, linkUrl: e.target.value })}
          placeholder="https://sagradamagia.com/..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
        />
      </div>
      <input
        type="text"
        value={block.data.linkText}
        onChange={(e) => onChange({ ...block.data, linkText: e.target.value })}
        placeholder="Texto do botão (ex: Ver coleção)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
      />
      <input
        type="text"
        value={block.data.backgroundColor || ''}
        onChange={(e) => onChange({ ...block.data, backgroundColor: e.target.value })}
        placeholder="Cor de fundo (opcional, ex: #D195CB)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
      />
    </div>
  );
}
