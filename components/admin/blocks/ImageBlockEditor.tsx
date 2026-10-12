'use client';
import React from 'react';
import { ImageBlock } from '@/lib/block-types';
import ImageUploader from '../ImageUploader';

interface Props {
  block: ImageBlock;
  onChange: (data: ImageBlock['data']) => void;
}

export default function ImageBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-3">
      <ImageUploader
        value={block.data.url}
        onChange={(url) => onChange({ ...block.data, url })}
        purpose="content"
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
    </div>
  );
}
