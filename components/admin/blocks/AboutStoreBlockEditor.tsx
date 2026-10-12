'use client';
import React from 'react';
import { AboutStoreBlock } from '@/lib/block-types';

interface Props {
  block: AboutStoreBlock;
  onChange: (data: AboutStoreBlock['data']) => void;
}

export default function AboutStoreBlockEditor({ block, onChange }: Props) {
  const addImage = () => {
    const url = prompt('URL da imagem:');
    if (url) {
      onChange({ ...block.data, imageUrls: [...block.data.imageUrls, url] });
    }
  };

  const removeImage = (index: number) => {
    const newUrls = [...block.data.imageUrls];
    newUrls.splice(index, 1);
    onChange({ ...block.data, imageUrls: newUrls });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={block.data.title}
        onChange={(e) => onChange({ ...block.data, title: e.target.value })}
        placeholder="Título (ex: Sobre a Sagrada Magia)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
      />
      <textarea
        value={block.data.description}
        onChange={(e) => onChange({ ...block.data, description: e.target.value })}
        placeholder="Descrição sobre a loja, missão, valores..."
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit resize-y"
      />

      {/* Imagens / Provas sociais */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-amiko text-gray-600">Imagens & Provas Sociais</label>
          <button
            type="button"
            onClick={addImage}
            className="px-3 py-1 bg-sagrada-magenta/10 text-sagrada-magenta rounded text-sm font-amiko hover:bg-sagrada-magenta/20 transition-colors"
          >
            + Adicionar imagem
          </button>
        </div>
        {block.data.imageUrls.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {block.data.imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt="" className="w-full h-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={block.data.buttonText}
          onChange={(e) => onChange({ ...block.data, buttonText: e.target.value })}
          placeholder="Texto do botão"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
        />
        <input
          type="url"
          value={block.data.buttonUrl}
          onChange={(e) => onChange({ ...block.data, buttonUrl: e.target.value })}
          placeholder="https://sagradamagia.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit"
        />
      </div>
    </div>
  );
}
