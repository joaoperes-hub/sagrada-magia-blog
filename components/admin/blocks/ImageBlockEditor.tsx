'use client';
import React from 'react';
import { ImageBlock } from '@/lib/block-types';

interface Props {
  block: ImageBlock;
  onChange: (data: ImageBlock['data']) => void;
}

export default function ImageBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-3">
      <input
        type="url"
        value={block.data.url}
        onChange={(e) => onChange({ ...block.data, url: e.target.value })}
        placeholder="URL da imagem (https://...)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
      />
      <input
        type="text"
        value={block.data.alt}
        onChange={(e) => onChange({ ...block.data, alt: e.target.value })}
        placeholder="Texto alternativo (descrição da imagem)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
      />
      <input
        type="text"
        value={block.data.caption || ''}
        onChange={(e) => onChange({ ...block.data, caption: e.target.value })}
        placeholder="Legenda (opcional)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
      />
      {block.data.url && (
        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
          <img src={block.data.url} alt={block.data.alt} className="w-full max-h-64 object-cover" />
        </div>
      )}
    </div>
  );
}
