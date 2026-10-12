'use client';
import React, { useRef, useState } from 'react';
import { AboutStoreBlock } from '@/lib/block-types';

interface Props {
  block: AboutStoreBlock;
  onChange: (data: AboutStoreBlock['data']) => void;
}

export default function AboutStoreBlockEditor({ block, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'about');
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no upload');
      onChange({ ...block.data, imageUrls: [...block.data.imageUrls, data.url] });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
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
          <label className="text-sm font-amiko text-gray-600">
            Imagens & Provas Sociais <span className="text-xs text-gray-400 font-niramit">(800×800, até ~150KB)</span>
          </label>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1 bg-sagrada-magenta/10 text-sagrada-magenta rounded text-sm font-amiko hover:bg-sagrada-magenta/20 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Enviando...' : '📤 Adicionar imagem'}
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
          }}
        />
        {error && <p className="text-red-500 text-xs font-niramit mb-2">⚠️ {error}</p>}
        {block.data.imageUrls.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {block.data.imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt="" className="w-full h-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
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
